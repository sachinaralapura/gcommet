import { getPrompt } from '../promptBuilder';
import { addCommentToFile, ErrorType, getActiveTextEditor, getConfiguration, handleError } from '../utils';
import { generatedComment, listModels } from '../ollama';
import { Ollama } from 'ollama';
import * as vscode from "vscode";
import fetch from "cross-fetch";


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

        const ollama: Ollama = new Ollama({ host: getConfiguration<string>('serverURL', 'http://127.0.0.1:11434'), fetch: fetch });

        const model: string = await GetOllamaModel(ollama);
        const { prompt, line } = await getPrompt(editor);
        console.log(prompt);
        const comment: string = await generatedComment(ollama, model, prompt);
        const fileURI = editor.document.uri;
        const fileName = editor.document.fileName;

        addCommentToFile(fileURI, fileName, line, comment);
        ollama.abort();
    } catch (error: any) {
        handleError(error);
        console.log(error);
    }
}