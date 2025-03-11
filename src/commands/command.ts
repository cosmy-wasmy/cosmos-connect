import * as vscode from 'vscode';
export class Commands {
    public static Register(context: vscode.ExtensionContext) {
        this.registerQueryTxCommand(context);
    }

    private static registerQueryTxCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryTx', () => {
            vscode.window.showInputBox({
                title: 'Transaction Hash',
                placeHolder: 'Enter the transaction hash',
            }).then((txHash) => {
                if (!txHash) {
                    return;
                }
                vscode.window.showInformationMessage(`Querying transaction ${txHash}...`);
            });
        }));
    }
}
