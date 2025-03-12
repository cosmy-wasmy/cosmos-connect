import * as vscode from 'vscode';
import { Configuration } from '../web/configuration';
export class Commands {
    public static Register(context: vscode.ExtensionContext) {
        this.registerQueryTxCommand(context);
        this.registerQueryNodeInfoCommand(context);
        this.registerQueryLatestBlockCommand(context);
        this.registerQueryBlockByHeightCommand(context);
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

    private static registerQueryLatestBlockCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryLatestBlock', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Querying latest block...',
                cancellable: false,
            }, () => {
                return new Promise(async (resolve, reject) => {
                    const baseUrl = Configuration.GetChainRestUrl();
                    const queryLatestBlockUrl = `${baseUrl}/cosmos/base/tendermint/v1beta1/blocks/latest`;
                    const response = await fetch(queryLatestBlockUrl);
                    if (!response.ok) {
                        vscode.window.showErrorMessage(`Failed to query latest block: ${response.statusText}`);
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

    private static registerQueryBlockByHeightCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryBlockByHeight', () => {
            vscode.window.showInputBox({
                title: 'Block Height',
                placeHolder: 'Enter the block height',
                validateInput: (value) => {
                    const sha256Regex = /^[0-9]+$/;
                    if (!sha256Regex.test(value)) {
                        return 'Please enter a valid block height';
                    }
                    return null;
                }
            }).then((blockHeight) => {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: `Querying block ${blockHeight}...`,
                    cancellable: false,
                }, () => {
                    return new Promise(async (resolve, reject) => {
                        const baseUrl = Configuration.GetChainRestUrl();
                        const queryBlockByHeightUrl = `${baseUrl}/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`;
                        const response = await fetch(queryBlockByHeightUrl);
                        if (!response.ok) {
                            vscode.window.showErrorMessage(`Failed to query block ${blockHeight}: Status: ${response.status} ${response.statusText}`);
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
}
