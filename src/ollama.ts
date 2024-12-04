import { ListResponse, Ollama } from "ollama";



export async function listModels(ollamaInstance: Ollama) {
    let list: ListResponse = await ollamaInstance.list();
    
    let models: string[] = [];
    for (const model of list.models) {
        models.push(model.name);
    }
    return models;
}
