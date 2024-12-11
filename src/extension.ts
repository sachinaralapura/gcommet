import * as vscode from 'vscode';
import { GenerateCommentCommand } from './commands/generateComment';
import { GfunctionCommentCommand } from './commands/functionComment';


// This function activates the extension by registering a command to generate comments.
// It logs a message and adds the disposable of this command to the context's subscriptions.
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "gcomment" is now active!');

	const gcdisposable = vscode.commands.registerCommand('gcomment.generateComment', GenerateCommentCommand);
	const gcFunctionDisposable = vscode.commands.registerCommand('gcomment.gfunctionComment', GfunctionCommentCommand);


	context.subscriptions.push(gcdisposable);
	context.subscriptions.push(gcFunctionDisposable);
}

export function deactivate() { }