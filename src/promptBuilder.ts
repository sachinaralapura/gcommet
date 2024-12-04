import * as vscode from "vscode";
import { ErrorType, getConfiguration, MyError } from "./utils";

// returns the content of the whole current active document if giveContext config is true
function getContext(editor: vscode.TextEditor): string {
    let context: string = "";
    if (getConfiguration<boolean>("giveContext")) {
        let document: vscode.TextDocument = editor.document;
        context = document.getText();
        if (context === "") { throw new MyError("no context (file is empty)", ErrorType.WARNING); }
    }
    return context;
}

// returns the copied content 
async function getCopiedCodeBlock(): Promise<string> {
    const codeBlock = await vscode.env.clipboard.readText().then((text) => {
        return text;
    });
    return codeBlock;
}

// return the selected content of current active document
function getSelectedCodeBlock(editor: vscode.TextEditor): string {
    let selection: vscode.Selection = editor.selection;
    const codeBlock: string = editor.document.getText(selection);
    return codeBlock;
}

// return the line above the selected content
async function getLineNumber(editor: vscode.TextEditor): Promise<number> {

    const selection = editor.selection;
    const startLine = selection.start.line;
    let lineAbove = selection.start.line - 1;

    if (lineAbove < 0) {

        const position = new vscode.Position(0, 0);
        await editor.edit((editBuilder) => {
            editBuilder.insert(position, '\n');
            lineAbove = lineAbove + 1;
        });

    } else {

        await editor.edit((editBuilder) => {
            const position = new vscode.Position(startLine, 0);
            editBuilder.insert(position, '\n');
            lineAbove = lineAbove + 1;
        });

    }

    return lineAbove;
}

export async function getPrompt(editor: vscode.TextEditor): Promise<{ prompt: string, line: number }> {

    const context = getContext(editor);

    let codeBlock = getSelectedCodeBlock(editor);

    if (codeBlock === "" || codeBlock === undefined) {
        codeBlock = await getCopiedCodeBlock();
        if (codeBlock === "") {
            throw new MyError("please select or copy code", ErrorType.INFO);
        }
    }

    let line: number = await getLineNumber(editor);

    let prompt = buildPrompt(codeBlock, editor.document.languageId, context);

    return { prompt, line };
}


function buildPrompt(codeBlock: string, language: string, context: string = "") {
    let prompt = `${context ? "code context : \`" + context + "\` \n" : ""}
    Given the code block below, write a brief, insightful comment that explains its purpose and functionality within the script. If applicable, mention any inputs expected in the code block.
    Keep the comment concise (maximum 2 lines). Wrap the comment with the appropriate comment syntax of ${language} language. Avoid assumptions about the complete code and focus on the provided block.
    Don't rewrite the code block. Just give the comment, and no need to specify the language again. 
    code block:
    \`${codeBlock}\`
    `;
    return prompt;
}