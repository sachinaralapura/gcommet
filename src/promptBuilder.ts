import * as vscode from "vscode";
import { ErrorType, getConfiguration, MyError } from "./utils/utils";
import { Editor } from "./editor";
// export class promptBuilder {

//     private editor: vscode.TextEditor;
//     constructor(editor: vscode.TextEditor) {
//         this.editor = editor;
//     }


//     public async getPromptAndLine(): Promise<{ prompt: string, line: number }> {
//         let prompt: string = await this.generatePrompt();
//         let line: number = await this.getLineNumber();
//         return { prompt, line };
//     }

//     public async generatePrompt(): Promise<string> {
//         const context = this.getContext();
//         let codeBlock = this.getSelectedCodeBlock();
//         if (codeBlock === "" || codeBlock === undefined) {
//             codeBlock = await this.getCopiedCodeBlock();
//             if (codeBlock === "") {
//                 throw new MyError("please select or copy code", ErrorType.INFO);
//             }
//         }
//         let prompt = this.buildPrompt(codeBlock, this.editor.document.languageId, context);
//         return prompt;
//     }

//     // returns the content of the whole current active document if giveContext config is true
//     private getContext(): string {
//         let context: string = "";
//         if (getConfiguration<boolean>("giveContext")) {
//             let document: vscode.TextDocument = this.editor.document;
//             context = document.getText();
//             if (context === "") { throw new MyError("no context (file is empty)", ErrorType.WARNING); }
//         }
//         return context;
//     }

//     // returns the copied content 
//     private async getCopiedCodeBlock(): Promise<string> {
//         return await vscode.env.clipboard.readText();
//     }

//     // return the selected content of current active document
//     private getSelectedCodeBlock(): string {
//         let selection: vscode.Selection = this.editor.selection;
//         const codeBlock: string = this.editor.document.getText(selection);
//         return codeBlock;
//     }

//     // return the line above the selected content
//     public async getLineNumber(): Promise<number> {

//         const selection = this.editor.selection;
//         const startLine = selection.start.line;
//         let lineAbove = selection.start.line - 1;

//         if (lineAbove < 0) {
//             const position = new vscode.Position(0, 0);
//             await this.editor.edit((editBuilder) => {
//                 editBuilder.insert(position, '\n');
//                 lineAbove = lineAbove + 1;
//             });
//         } else {
//             await this.editor.edit((editBuilder) => {
//                 const position = new vscode.Position(startLine, 0);
//                 editBuilder.insert(position, '\n');
//                 lineAbove = lineAbove + 1;
//             });
//         }
//         return lineAbove;
//     }

//     private buildPrompt(codeBlock: string, language: string, context: string = "") {
//         let prompt = getConfiguration<string>("prompt").replace("{language}", language);
//         return `${context ? "code context : \`" + context + "\` \n" : ""}
//                 ${prompt}
//                 code block:
//                 \`${codeBlock}\` `;
//     }
// }

// product
export class Prompt {
    private context: string = "";
    private promptText: string = "";
    private codeBlock: string = "";
    private fullPrompt: string = "";

    setContext(contex: string) { this.context = contex; }
    setPromptText(prompt: string) { this.promptText = prompt; }
    setCodeBlock(codeBlock: string) { this.codeBlock = codeBlock; }
    setFullPrompt(fullPrompt: string) { this.fullPrompt = fullPrompt; }

    getContext() { return this.context; }
    getPromptText() { return this.promptText; }
    getCodeBlock() { return this.codeBlock; }
    getFullPrompt() { return this.fullPrompt; };
}

// builer interface
interface PromptBuilderInterface {
    buildContext(): PromptBuilderInterface
    buildPromptText(): PromptBuilderInterface
    buildCodeBlock(): PromptBuilderInterface
    build(): Prompt
}

// concrete builder
export class PromptBuilder implements PromptBuilderInterface {
    private prompt: Prompt;
    private editor: Editor;

    constructor(editor: Editor) {
        this.editor = editor;
        this.prompt = new Prompt();
    }

    buildContext(): PromptBuilderInterface {
        let context: string = this.editor.getEditorContent();
        context = `code context : 
                        \`${context}\`\n`;
        this.prompt.setContext(context);
        return this;
    }

    buildPromptText(): PromptBuilderInterface {
        let language: string = this.editor.getLanguage();
        let prompt: string = getConfiguration<string>("prompt").replace("{language}", language);
        prompt = `\n${prompt}\n`;
        this.prompt.setPromptText(prompt);
        return this;
    }

    buildCodeBlock(): PromptBuilderInterface {
        let codeBlock = this.editor.getSelection();
        if (codeBlock === "" || codeBlock === undefined) {
            throw new MyError("please select code", ErrorType.INFO);
        }
        codeBlock = `code block:
                        \n\`${codeBlock}\`\n`;
        this.prompt.setCodeBlock(codeBlock);
        return this;
    }

    build(): Prompt {
        let context: string = this.prompt.getContext();
        let promptText: string = this.prompt.getPromptText();
        let codeBlock: string = this.prompt.getCodeBlock();
        this.prompt.setFullPrompt(context + promptText + codeBlock);
        return this.prompt;
    }
}