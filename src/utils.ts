import { error } from "console";
import * as vscode from "vscode";

export function getActiveTextEditor(): vscode.TextEditor {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (editor === undefined) {
        throw new Error("Failed to retrieve editor");
    }
    return editor;
}