import { Prompt, PromptBuilder } from '../promptBuilder';
import { getConfiguration, handleError } from '../utils/utils';
import { OllamaServer } from '../ollama';
import * as vscode from "vscode";
import { ActiveEditor, getActiveTextEditor } from '../editor';


async function GetOllamaModelFromUser(models: string[]): Promise<string> {
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

        const editor: ActiveEditor = ActiveEditor.getInstance();

        // connect to ollama server
        const serverUrl: string = getConfiguration<string>('serverURL', 'http://127.0.0.1:11434');
        const ollamaServer: OllamaServer = OllamaServer.getInstance(serverUrl);
        const models: string[] = await ollamaServer.listModels();
        const model: string = await GetOllamaModelFromUser(models);

        // build the prompt
        const promptbuilder: PromptBuilder = new PromptBuilder(editor);
        let prompt: Prompt = getConfiguration<boolean>("giveContext") ? promptbuilder.buildContext().buildPromptText().buildCodeBlock().build() : promptbuilder.buildPromptText().buildCodeBlock().build();
        const fullPrompt: string = prompt.getFullPrompt();
        console.log(fullPrompt);

        // generate comment
        const comment: string = await ollamaServer.generateComment(model, fullPrompt);

        // write comment to textEditor
        // comment will be added to the line above selection
        await editor.addCommentToFile(comment);

        ollamaServer.abort();
    } catch (error: any) {
        handleError(error);
        console.log(error);
    }
}