import { buildPrompt } from '../promptBuilder';
import { addCommentToFile, ErrorType, getActiveTextEditor, getCurrentLine } from '../utils';
import { generatedComment, listModels } from '../ollama';
import { Ollama } from 'ollama';
import * as vscode from "vscode";
import fetch from "cross-fetch";

function GetOllamaUrl(): string {
    const config = vscode.workspace.getConfiguration('ollama');
    const url = config.get<string>('serverURL', 'http://127.0.0.1:11434');
    return url;
}

async function GetOllamaModel(ollama: Ollama): Promise<string> {
    const models = await listModels(ollama);
    const config = vscode.workspace.getConfiguration('ollama');
    let model: string | undefined = config.get<string>("modelName");
    if (model === "" || model === undefined) {
        if (models.length === 0) {
            throw new Error("No model found");
        }
        let selectedModel: string | undefined = await vscode.window.showQuickPick(models, {
            title: 'Select an Ollama Model',
            placeHolder: 'Choose a model to use',
            canPickMany: false,
            ignoreFocusOut: true,
        });
        if (selectedModel === undefined || selectedModel === "") {
            throw new Error("select a model");
        }
        return selectedModel;
    }
    return model;
}

export async function GenerateCommentCommand() {
    try {

        const editor: vscode.TextEditor = getActiveTextEditor();

        const ollama: Ollama = new Ollama({ host: GetOllamaUrl(), fetch: fetch });

        const model: string = await GetOllamaModel(ollama);
        const prompt: string | undefined = await buildPrompt(editor);

        const comment: string = await generatedComment(ollama, model, prompt);
        const fileURI = editor.document.uri;
        const fileName = editor.document.fileName;
        const currentLine = getCurrentLine(editor);

        addCommentToFile(fileURI, fileName, currentLine, comment);

    } catch (error: any) {
        if (error?.name === "FetchError") {
            vscode.window.showErrorMessage(`Fetch Error`);
        } else if (error?.type === ErrorType.ERROR) {
            vscode.window.showErrorMessage(error?.message);
        }
        else if (error?.type === ErrorType.WARNING) {
            vscode.window.showWarningMessage(error?.message);
        } else {
            vscode.window.showInformationMessage(error?.message);
        }
        console.log(error);
    }
}