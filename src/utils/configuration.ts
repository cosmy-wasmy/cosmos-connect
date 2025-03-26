import * as vscode from 'vscode';

export class Configuration {
    public static GetChainConfigs(): ChainConfig[] {
        return vscode.workspace.getConfiguration().get<ChainConfig[]>("cosmos-connect.chains", []);
    }

    public static GetWorkspaceChainConfig(): ChainConfig {
        const workspaceChain = vscode.workspace.getConfiguration().get<string>("cosmos-connect.workspaceChain");
        const knownConfigs = this.GetChainConfigs();
        const config = knownConfigs.find(c => c.name !== "" && c.name === workspaceChain);
        if (config) {
            return config;
        }
        return knownConfigs[0];
    }

    public static SetWorkspaceChainConfig(config: ChainConfig): Thenable<void> {
        return vscode.workspace.getConfiguration().update("cosmos-connect.workspaceChain", config.name, vscode.ConfigurationTarget.Workspace);
    }
}

export enum Environment {
    Node = 'node',
    Web = 'web'
}

export class ChainConfig {
    public name!: string;
    public rest!: string;
    public websocket!: string;
}
