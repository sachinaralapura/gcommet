import * as vscode from "vscode";
import { ErrorType, MyError } from "./utils/type";


export function getActiveTextEditor(): vscode.TextEditor {
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    if (editor === undefined) {
        throw new MyError("Failed to retrieve editor", ErrorType.ERROR);
    }
    return editor;
}



export interface Editor {
    editor: vscode.TextEditor,
    document: vscode.TextDocument
    getLanguage(): string,
    getEditorContent(): string,
    getSelection(): string,
}

export class ActiveEditor implements Editor {
    editor: vscode.TextEditor;
    document: vscode.TextDocument;

    private static self: ActiveEditor;

    private constructor() {
        this.editor = this.getActiveEditor();
        this.document = this.editor.document;
    }

    private getActiveEditor(): vscode.TextEditor {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (editor === undefined) {
            throw new MyError("Failed to retrieve editor", ErrorType.ERROR);
        }
        return editor;
    }

    public static getInstance(): ActiveEditor {
        if (!ActiveEditor.self) {
            ActiveEditor.self = new ActiveEditor();
        }
        return this.self;
    }

    getLanguage(): string {
        return this.editor.document.languageId;
    }

    getEditorContent(): string {
        let document: vscode.TextDocument = this.editor.document;
        let content = document.getText();
        return content;
    }

    getSelection(): string {
        let selection: vscode.Selection = this.editor.selection;
        const codeBlock: string = this.editor.document.getText(selection);
        return codeBlock;
    }


    async getLineNumber(): Promise<number> {

        const selection = this.editor.selection;
        const startLine = selection.start.line;
        let lineAbove = selection.start.line - 1;

        if (lineAbove < 0) {
            const position = new vscode.Position(0, 0);
            await this.editor.edit((editBuilder) => {
                editBuilder.insert(position, '\n');
                lineAbove = lineAbove + 1;
            });
        } else {
            await this.editor.edit((editBuilder) => {
                const position = new vscode.Position(startLine, 0);
                editBuilder.insert(position, '\n');
                lineAbove = lineAbove + 1;
            });
        }
        return lineAbove;
    }

    public async addCommentToFile(generatedComment: string,) {
        const fileURI = this.document.uri;
        const fileName = this.document.fileName;
        const lineNumber: number = await this.getLineNumber();
        const edit = new vscode.WorkspaceEdit();
        edit.insert(fileURI, new vscode.Position(lineNumber, 0), generatedComment.trim());
        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage(`Commented added to ${fileName} at line ${lineNumber + 1}`);
    }
}

