import * as vscode from 'vscode';
import { Configuration } from '../utils/configuration';
import { CosmosWS } from '../utils/ws';
import { CustomItem } from '../views/custom';
import { Views } from '../views/view';

export class Commands {
    public static Register(context: vscode.ExtensionContext) {
        this.registerQueryTxCommand(context);
        this.registerQueryNodeInfoCommand(context);
        this.registerQueryLatestBlockCommand(context);
        this.registerQueryBlockByHeightCommand(context);
        this.registerQueryAllModuleAccountsCommand(context);
        this.registerQueryAllDenomsMetadataCommand(context);
        this.registerSubscibeToNewBlockCommand(context);
        this.registerSubscibeToCustomEventCommand(context);
        this.registerOpenCustomEventCommand(context);
        this.registerSelectChainCommand(context);
        this.registerClearBlocksTreeViewCommand(context);
        this.registerClearCustomTreeViewCommand(context);
    }

    private static registerSelectChainCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.selectChain', () => {
            const configs = Configuration.GetChainConfigs();
            vscode.window.showQuickPick(configs.map(c => c.name), {
                canPickMany: false,
                placeHolder: configs[0].name,
                title: 'Select a chain for the workspace'
            }).then((selectedChain) => {
                const chain = configs.find(c => c.name === selectedChain);
                if (chain) {
                    Configuration.SetWorkspaceChainConfig(chain).then(() => {
                        Views.UpdateChainConfigViewItem();
                        vscode.window.showInformationMessage(`Selected chain: ${chain.name}`);
                    });
                }
            });;

        }));
    }

    private static registerQueryTxCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.queryTx', async (txHash) => {
            if (!txHash) {
                txHash = await vscode.window.showInputBox({
                    title: 'Transaction Hash',
                    placeHolder: 'Enter the transaction hash',
                    validateInput: (value) => {
                        const sha256Regex = /^[a-fA-F0-9]{64}$/;
                        if (!sha256Regex.test(value)) {
                            return 'Please enter a valid SHA-256 hash';
                        }
                        return null;
                    }
                });
            }
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Querying transaction...',
                cancellable: false,
            }, () => {
                return new Promise(async (resolve, reject) => {
                    const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
                    const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
                    const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
                        const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
                    const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
                    const baseUrl = Configuration.GetWorkspaceChainConfig().rest;
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
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.subscribeToNewBlock', async () => {
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                cancellable: true,
            }, (progress, cancellationToken) => {
                return new Promise(async (resolve, reject) => {
                    vscode.commands.executeCommand("setContext", "showSubscriptionButton", false);
                    progress.report({ message: 'Creating WebSocket connection' });
                    const config = Configuration.GetWorkspaceChainConfig();
                    const ws = new CosmosWS(config.websocket);
                    progress.report({ message: 'Subscribing to new blocks of ' + config.name });
                    ws.SubscribeToQuery("tm.event='NewBlock'", (block) => {
                        const height = block.data.value.block.header.height;
                        const time = block.data.value.block.header.time;
                        global.blocksViewProvider.appendBlock(height, block.data.value.block.data.txs, time);
                    }
                    );
                    cancellationToken.onCancellationRequested(() => {
                        vscode.commands.executeCommand("setContext", "showSubscriptionButton", true);
                        progress.report({ message: 'Unsubscribing from NewBlock event' });
                        ws.Unsubscribe();
                        resolve(undefined);
                    });
                })
            })
        }));
    }

    private static registerSubscibeToCustomEventCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.subscribeToCustomEvent', async () => {
            vscode.window.showInputBox({
                title: 'Custom Event',
                placeHolder: "tm.event='Tx'",
            }).then((query) => {
                if (query) {
                    vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                        cancellable: true,
                    }, (progress, cancellationToken) => {
                        return new Promise(async (resolve, reject) => {
                            vscode.commands.executeCommand("setContext", "showSubscriptionButton", false);
                            progress.report({ message: 'Creating WebSocket connection' });
                            const config = Configuration.GetWorkspaceChainConfig();
                            const ws = new CosmosWS(config.websocket);
                            progress.report({ message: 'Subscribing to custom events of ' + config.name });
                            ws.SubscribeToQuery(query, (event) => {
                                global.customViewProvider.appendCustomItem(JSON.stringify(event, null, 2));
                            }
                            );
                            cancellationToken.onCancellationRequested(() => {
                                vscode.commands.executeCommand("setContext", "showSubscriptionButton", true);
                                progress.report({ message: 'Unsubscribing from custom event' });
                                ws.Unsubscribe();
                                resolve(undefined);
                            });
                        })
                    });
                }
            });

        }));
    }

    private static registerOpenCustomEventCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.openCustomEvent', async (event: CustomItem) => {
            if (event) {
                vscode.workspace.openTextDocument({
                    language: "json",
                    content: event.info
                }).then(doc => {
                    vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
                });
            }
        }));
    }

    private static registerClearBlocksTreeViewCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.clearBlocksView', () => {
            global.blocksViewProvider.clearAllItems();
        }));
    }

    private static registerClearCustomTreeViewCommand(context: vscode.ExtensionContext) {
        context.subscriptions.push(vscode.commands.registerCommand('cosmos-connect.clearCustomView', () => {
            global.customViewProvider.clearAllItems();
        }));
    }
}
