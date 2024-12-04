import { GenerateResponse, ListResponse, Ollama } from "ollama";



export async function listModels(ollamaInstance: Ollama) {
    let list: ListResponse = await ollamaInstance.list();

    let models: string[] = [];
    for (const model of list.models) {
        models.push(model.name);
    }
    return models;
}

export async function generatedComment(ollama: Ollama, model: string, prompt: string): Promise<string> {
    const t0 = performance.now();
    const response: GenerateResponse = await ollama.generate({
        model: model,
        prompt: prompt,
    });

    const t1 = performance.now();
    console.log('LLM took: ', t1 - t0, ', seconds');

    return response.response;
}