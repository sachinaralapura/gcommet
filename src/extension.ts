import * as vscode from 'vscode';
import { GenerateCommentCommand } from './commands/generateComment';


// This function activates the extension by registering a command to generate comments.
// It logs a message and adds the disposable of this command to the context's subscriptions.
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gcomment" is now active!');

	const gcommentdisposable = vscode.commands.registerCommand('gcomment.generateComment', GenerateCommentCommand);

	context.subscriptions.push(gcommentdisposable);
}

export function deactivate() { }