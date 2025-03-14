import * as vscode from 'vscode';

export class Configuration {
    public static GetChainRestUrl(): String {
        return vscode.workspace.getConfiguration().get<String>("cosmos-connect.rest", "");
    }

    public static GetChainWsUrl(): string {
        return vscode.workspace.getConfiguration().get<string>("cosmos-connect.websocket", "");
    }
}

export enum Environment {
    Node = 'node',
    Web = 'web'
}
