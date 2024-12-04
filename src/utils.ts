import * as vscode from "vscode";

export function getActiveTextEditor(): vscode.TextEditor {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (editor === undefined) {
        throw new MyError("Failed to retrieve editor", ErrorType.ERROR);
    }
    return editor;
}

export function getCurrentLine(editor: vscode.TextEditor) {
    const currentLine: number = editor.selection.active.line;
    return currentLine;
}


export async function addCommentToFile(fileURI: vscode.Uri, fileName: string, line: number, generatedComment: string,) {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(fileURI, new vscode.Position(line, 0), generatedComment.trim());
    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage(`Commented added to ${fileName} at line ${line + 1}`);
}

export class MyError extends Error {
    type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message); // Pass the message to the base Error class
        this.type = type;
        // Ensure the name of this error matches the class name
        this.name = this.constructor.name;

        // Maintain proper stack trace (only works in V8 engines like Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export enum ErrorType {
    INFO = 1,
    ERROR = 2,
    WARNING = 3
}