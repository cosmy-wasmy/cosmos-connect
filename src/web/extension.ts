// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from '../commands/command';
import { Environment } from '../utils/configuration';
import { BlocksProvider } from '../views/blocks';
import { CustomProvider } from '../views/custom';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	global.environment = Environment.Web;
	global.blocksViewProvider = new BlocksProvider();
	global.customViewProvider = new CustomProvider();
	vscode.window.registerTreeDataProvider('blocks', global.blocksViewProvider);
	vscode.window.registerTreeDataProvider('custom', global.customViewProvider);
	Commands.Register(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
