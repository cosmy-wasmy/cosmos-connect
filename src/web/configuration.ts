import * as vscode from 'vscode';

export class Configuration {
    public static GetChainRestUrl(): String {
        return vscode.workspace.getConfiguration().get<String>("cosmos-connect.rest", "");
    }
}
