import * as vscode from 'vscode';
import { Configuration } from '../utils/configuration';
export class Views {

    private static selectedChain: vscode.StatusBarItem;

    public static Register() {
        this.registerChainConfigViewItem();
        vscode.commands.executeCommand("setContext", "showSubscriptionButton", true);
    }

    public static UpdateChainConfigViewItem() {
        const config = Configuration.GetWorkspaceChainConfig();
        this.selectedChain.text = "$(plug)" + config.name;
        this.selectedChain.show();
    }

    private static registerChainConfigViewItem() {
        this.selectedChain = vscode.window.createStatusBarItem("cosmos-connect", vscode.StatusBarAlignment.Left, 100);
        this.selectedChain.tooltip = "Select a different chain";
        this.selectedChain.command = "cosmos-connect.selectChain";
        this.UpdateChainConfigViewItem();
    }
}
