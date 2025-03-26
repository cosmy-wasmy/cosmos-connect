import { decodeTxRaw } from "@cosmjs/proto-signing";
import * as base64js from "base64-js";
import * as vscode from 'vscode';

export class BlocksProvider implements vscode.TreeDataProvider<BlockItem> {
    private blocks: BlockItem[] = [];

    constructor() { }

    public async appendBlock(height: string, txs: string[], time: string) {
        const label = height;
        const id = height;
        const description = `txs: ${txs.length}`;
        const tooltip = (new Date(time)).toLocaleString();
        const txs_items = await Promise.all(txs.map(async (raw_tx, index) => {
            const binaryData = atob(raw_tx);
            const buffer = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
                buffer[i] = binaryData.charCodeAt(i);
            }
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const tx_hash = Array.from(new Uint8Array(hashBuffer))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('').toLocaleUpperCase();
            const tx = decodeTxRaw(base64js.toByteArray(raw_tx));
            const tx_label = `tx[${index}]`;
            const tx_id = tx_hash;
            const tx_description = tx.body.memo;
            const txhashItem = new BlockItem("hash", `${tx_id}-hash`, tx_hash, tx_hash, BlockItemType.TxHash, []);
            const msgsItem = new BlockItem("msgs", `${tx_id}-msgs`, `${tx.body.messages.length}`, `msgs: ${tx.body.messages.length}`, BlockItemType.Info, tx.body.messages.map((msg, index) => {
                const msg_label = `msg[${index}]`;
                const msg_id = `${tx_id}-${index}`;
                const msg_description = msg.typeUrl;
                return new BlockItem(msg_label, msg_id, msg_description, msg_description, BlockItemType.Message, []);
            }));
            const msgs_items = [txhashItem, msgsItem];
            return new BlockItem(tx_label, tx_id, tx_description, tx_hash, BlockItemType.Transaction, msgs_items);
        }));
        const block = new BlockItem(label, id, description, tooltip, BlockItemType.Block, txs_items);
        this.blocks.push(block);
        this._onDidChangeTreeData.fire(undefined);
    }

    private _onDidChangeTreeData = new vscode.EventEmitter<BlockItem | undefined>();
    readonly onDidChangeTreeData?: vscode.Event<BlockItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: BlockItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: BlockItem | undefined): vscode.ProviderResult<BlockItem[]> {
        if (!element) {
            return this.blocks;
        } else {
            return element.children;
        }
    }
    getParent?(element: BlockItem): vscode.ProviderResult<BlockItem> {
        return undefined;
    }
    resolveTreeItem?(item: vscode.TreeItem, element: BlockItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        return element;
    }

}

class BlockItem extends vscode.TreeItem {
    children: BlockItem[];
    itemtype: BlockItemType;

    constructor(label: string, id: string, description: string, tooltip: string, itemtype: BlockItemType, children: BlockItem[]) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.id = id;
        this.description = description;
        this.tooltip = tooltip;
        this.children = children;
        this.itemtype = itemtype;
        if (children.length > 0) {
            this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
        }
        if (itemtype == BlockItemType.TxHash) {
            this.command = {
                command: "cosmos-connect.queryTx",
                title: "View Transaction",
                arguments: [description],
                tooltip: "View Transaction"
            };
        }
    }
}

enum BlockItemType {
    Block = 1,
    Transaction = 2,
    Message = 3,
    TxHash = 4,
    Info = 5
}
