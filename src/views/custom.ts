import * as vscode from 'vscode';

export class CustomProvider implements vscode.TreeDataProvider<CustomItem> {
    private customItems: CustomItem[] = [];
    private customItemsCount = 0;

    constructor() { }

    public async appendCustomItem(info: string) {
        const custom = new CustomItem(`customEvent[${this.customItemsCount}]`, this.customItemsCount.toString(), info.slice(0, 100), "", info);
        this.customItems.push(custom);
        this.customItemsCount++;
        this._onDidChangeTreeData.fire(undefined);
    }

    public clearAllItems() {
        this.customItems = [];
        this.customItemsCount = 0;
        this._onDidChangeTreeData.fire(undefined);
    }

    private _onDidChangeTreeData = new vscode.EventEmitter<CustomItem | undefined>();
    readonly onDidChangeTreeData?: vscode.Event<CustomItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: CustomItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: CustomItem | undefined): vscode.ProviderResult<CustomItem[]> {
        if (!element) {
            return this.customItems;
        }
    }
    getParent?(element: CustomItem): vscode.ProviderResult<CustomItem> {
        return undefined;
    }
    resolveTreeItem?(item: vscode.TreeItem, element: CustomItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        return element;
    }

}

export class CustomItem extends vscode.TreeItem {
    info: string;

    constructor(label: string, id: string, description: string, tooltip: string, info: string) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.id = id;
        this.description = description;
        this.tooltip = tooltip;
        this.info = info;
        this.command = {
            command: 'cosmos-connect.openCustomEvent',
            title: 'View',
            arguments: [this]
        }
    }
}
