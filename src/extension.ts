import * as vscode from 'vscode';
import { GenerateComment } from './commands/generateComment';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gcomment" is now active!');

	const gcommentdisposable = vscode.commands.registerCommand('gcomment.generateComment', GenerateComment);

	context.subscriptions.push(gcommentdisposable);
}

export function deactivate() { }