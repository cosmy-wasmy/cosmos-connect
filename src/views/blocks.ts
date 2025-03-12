import * as vscode from 'vscode';

export class BlocksProvider implements vscode.TreeDataProvider<BlockItem> {
    private blocks: BlockItem[] = [];

    constructor() {}

    public appendBlock(height: string, txCount: Number, time: string) {
        const block = new BlockItem(height, txCount, time);
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
    height: string;
    txCount: Number;
    time: string;

    constructor(height: string, txCount: Number, time: string) {
        super(height, vscode.TreeItemCollapsibleState.Collapsed);
        this.id = height;
        this.iconPath = new vscode.ThemeIcon('debug');
        this.description = `${txCount} transactions`;
        this.tooltip = `${time}`;
        
        this.height = height;
        this.txCount = txCount;
        this.time = time;
    }
}
