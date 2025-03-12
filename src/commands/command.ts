import * as vscode from 'vscode';
import { Configuration } from '../web/configuration';

export class Commands {
    public static Register(context: vscode.ExtensionContext) {
        this.registerQueryTxCommand(context);
        this.registerQueryNodeInfoCommand(context);
        this.registerQueryLatestBlockCommand(context);
        this.registerQueryBlockByHeightCommand(context);
        this.registerQueryAllModuleAccountsCommand(context);
        this.registerQueryAllDenomsMetadataCommand(context);
        this.registerSubscibeToNewBlockCommand(context);
        this.registerUnsubscribeToNewBlockCommand(context);
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

    private static registerQueryAllModuleAccountsCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryAllModuleAccounts', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Querying all module accounts...',
                cancellable: false,
            }, () => {
                return new Promise(async (resolve, reject) => {
                    const baseUrl = Configuration.GetChainRestUrl();
                    const queryAllModuleAccountsUrl = `${baseUrl}/cosmos/auth/v1beta1/module_accounts`;
                    const response = await fetch(queryAllModuleAccountsUrl);
                    if (!response.ok) {
                        vscode.window.showErrorMessage(`Failed to query all module accounts: ${response.statusText}`);
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
            });
        }));
    }

    private static registerQueryAllDenomsMetadataCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryAllDenomsMetadata', () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Querying all denoms metadata...',
                cancellable: false,
            }, () => {
                return new Promise(async (resolve, reject) => {
                    const baseUrl = Configuration.GetChainRestUrl();
                    const queryAllDenomsMetadataUrl = `${baseUrl}/cosmos/bank/v1beta1/denoms_metadata`;
                    const response = await fetch(queryAllDenomsMetadataUrl);
                    if (!response.ok) {
                        vscode.window.showErrorMessage(`Failed to query all denoms metadata: ${response.statusText}`);
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
            });
        }));
    }

    private static registerSubscibeToNewBlockCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.subscribeToNewBlock', () => {
            const ws = new WebSocket('wss://rpc.lavenderfive.com/cosmoshub/websocket');
            const params = `{"jsonrpc": "2.0","method": "subscribe","id": 0,"params": {"query": "tm.event='NewBlock'"}}`;
            ws.onopen = () => {
                ws.send(params);
            };
            let count = 0;
            ws.onmessage = function(msg) {
                const data = JSON.parse(msg.data);
                if (data.id !== 0) {
                    return;
                }
                if (!data.result || Object.keys(data.result).length === 0) {
                    vscode.window.showInformationMessage('Subscribed to new blocks...');
                    return;
                }
                const block = data.result;
                const height = block.data.value.block.header.height;
                const time = block.data.value.block.header.time;
                const txCount = block.data.value.block.data.txs.length;
                global.blocksViewProvider.appendBlock(height, block.data.value.block.data.txs, time);
                if (txCount > 0) {
                    count += 1;
                    vscode.workspace.openTextDocument({
                        language: "json",
                        content: JSON.stringify(block, null, 2)
                    }).then(doc => {
                        vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                    });
                }
                if (count > 3) {
                    ws.close();
                    vscode.window.showInformationMessage('Unsubscribed from new blocks...');
                }
            }
        }));
    }

    private static registerUnsubscribeToNewBlockCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.unsubscribeFromNewBlock', () => {
            vscode.window.showInformationMessage('Unsubscribed from new blocks...');
        }));
    }
}
