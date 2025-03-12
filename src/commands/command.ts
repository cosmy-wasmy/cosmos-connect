import * as vscode from 'vscode';
import { Configuration } from '../web/configuration';
export class Commands {
    public static Register(context: vscode.ExtensionContext) {
        this.registerQueryTxCommand(context);
        this.registerQueryNodeInfoCommand(context);
    }

    private static registerQueryTxCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryTx', () => {
            vscode.window.showInputBox({
                title: 'Transaction Hash',
                placeHolder: 'Enter the transaction hash',
                validateInput: (value) => {
                    const sha256Regex = /^[a-fA-F0-9]{64}$/;
                    if (!sha256Regex.test(value)) {
                        return 'Please enter a valid SHA-256 hash';
                    }
                    return null;
                }
            }).then((txHash) => {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Querying transaction...',
                    cancellable: false,
                }, () => {
                    return new Promise(async (resolve, reject) => {
                        const baseUrl = Configuration.GetChainRestUrl();
                        const queryTxUrl = `${baseUrl}/cosmos/tx/v1beta1/txs/${txHash}`;
                        const response = await fetch(queryTxUrl);
                        if (!response.ok) {
                            vscode.window.showErrorMessage(`Failed to query transaction: ${response.statusText}`);
                            reject();
                        }
                        const data = await response.json();
                        const display = JSON.stringify(data, null, 2);
                        vscode.workspace.openTextDocument({
                            language: "json",
                            content: display
                        }).then(doc => {
                            vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                        });
                        resolve(undefined);
                    });
                })
            });
        }));
    }

    private static registerQueryNodeInfoCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryNodeInfo', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Querying node info...',
                cancellable: false,
            }, () => {
                return new Promise(async (resolve, reject) => {
                    const baseUrl = Configuration.GetChainRestUrl();
                    const queryNodeInfoUrl = `${baseUrl}/cosmos/base/tendermint/v1beta1/node_info`;
                    const response = await fetch(queryNodeInfoUrl);
                    if (!response.ok) {
                        vscode.window.showErrorMessage(`Failed to query node info: ${response.statusText}`);
                        reject();
                    }
                    const data = await response.json();
                    const display = JSON.stringify(data, null, 2);
                    vscode.workspace.openTextDocument({
                        language: "json",
                        content: display
                    }).then(doc => {
                        vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                    });
                    resolve(undefined);
                });
            })
        }));
    }
}
