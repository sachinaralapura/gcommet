import { buildPrompt } from '../promptBuilder';
import { getActiveTextEditor } from '../utils';
import { listModels } from '../ollama';
import { Ollama } from 'ollama';
import * as vscode from "vscode";
import fetch from "cross-fetch";

function GetOllamaUrl(): string {
    const config = vscode.workspace.getConfiguration('ollama');
    const url = config.get<string>('serverURL', 'http://127.0.0.1:11434');
    return url;
}

async function GetOllamaModel(ollama: Ollama) {
    const models = await listModels(ollama);
    const config = vscode.workspace.getConfiguration('ollama');
    let model = config.get<string>("modelName");
    if (model === "") {
        if (models.length === 0) {
            throw new Error("No model found");
        }

        let selectedModel = await vscode.window.showQuickPick(models, {
            title: 'Select an Ollama Model',
            placeHolder: 'Choose a model to use',
            canPickMany: false,
            ignoreFocusOut: true,
        });
        console.log(selectedModel);
        return selectedModel;
    }
    return model;

}

export async function GenerateComment() {
    try {
        const editor: vscode.TextEditor | undefined = getActiveTextEditor();
        const prompt: string | undefined = await buildPrompt(editor);
        const ollama: Ollama = new Ollama({ host: GetOllamaUrl(), fetch: fetch });

        GetOllamaModel(ollama);

        vscode.window.showInformationMessage("Hello world");
    } catch (error: any) {
        if (error.name = "FetchError") {
            vscode.window.showErrorMessage(`Fetch Error`);
        } else {
            vscode.window.showErrorMessage(error.message);
        }
        console.log(error);
    }
}