import * as vscode from 'vscode';
import { GenerateCommentCommand } from './commands/generateComment';


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gcomment" is now active!');

	const gcommentdisposable = vscode.commands.registerCommand('gcomment.generateComment', GenerateCommentCommand);

	context.subscriptions.push(gcommentdisposable);
}

export function deactivate() {	}