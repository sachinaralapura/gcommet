import * as vscode from "vscode";
import { ErrorType, MyError } from "./utils";

function getScriptContent(editor: vscode.TextEditor): string {
    let document: vscode.TextDocument = editor.document;
    const content: string = document.getText();
    return content;
}

async function getCopiedCodeBlock(): Promise<string> {
    const codeBlock = await vscode.env.clipboard.readText().then((text) => {
        return text;
    });
    return codeBlock;
}

function getSelectedCodeBlock(editor: vscode.TextEditor): string {
    let selection: vscode.Selection = editor.selection;
    const codeBlock: string = editor.document.getText(selection);
    return codeBlock;
}

export async function buildPrompt(editor: vscode.TextEditor) {

    const scriptContent = getScriptContent(editor);
    let codeBlock = getSelectedCodeBlock(editor);
    if (codeBlock === "" || codeBlock === undefined) {
        codeBlock = await getCopiedCodeBlock();
        if (codeBlock === "") {
            throw new MyError("please select or copy code", ErrorType.INFO);
        }
    }
    if (scriptContent === "") { throw new MyError("no context (file is empty)", ErrorType.WARNING); }

    let prompt = getPrompt(scriptContent, codeBlock);
    if (prompt === undefined) { throw new MyError("Failed to generate prompt", ErrorType.ERROR); }

    return prompt;
}



function getPrompt(context: string, codeBlock: string = "") {
    let prompt = `complete code:
    \`${context}\`

    Given the code block below, write a brief, insightful comment that explains its purpose and functionality within the script. If applicable, mention any inputs expected in the code block.
    Keep the comment concise (maximum 2 lines). Wrap the comment with the appropriate comment. Avoid assumptions about the complete code and focus on the provided block. Don't rewrite the code block.

    code block:
    \`${codeBlock}\`
    
    `;
    return prompt;
}