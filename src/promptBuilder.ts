import * as vscode from "vscode";

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

function getSelectedCodeBlock(editor: vscode.TextEditor) {
    const codeBlock = editor.selection;
}

export async function buildPrompt(editor: vscode.TextEditor) {

    const scriptContent = getScriptContent(editor);
    const codeBlock = await getCopiedCodeBlock();

    if (codeBlock === "") { throw new Error("Clipboard empty"); }
    if (scriptContent === "") { throw new Error("no context (file is empty)"); }

    let prompt = getPrompt(scriptContent, codeBlock);
    if (prompt === undefined) { throw Error("Failed to generate prompt"); }

    return prompt;
}

// async function getSymbols(editor: vscode.TextEditor) {
//     const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', editor.document.uri);
//     console.log(symbols);
// }


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