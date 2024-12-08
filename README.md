# Gcomments: AI-Powered Code Comment Generation for VS Code

This VS Code extension leverages Ollama AI models to effortlessly generate comprehensive comments for your code, enhancing maintainability and readability.

### Features:

- Seamless Integration: Generate comments directly within your VS Code environment, streamlining your workflow.
- AI-Driven Insights: Utilize Ollama AI models to create insightful and accurate comments that capture the essence of your code.
- Improved Code Clarity: Communicate code purpose and functionality effectively with well-structured comments.
- Safety : Since Ollama models are ran locally, it's safe to trust.

### Requirement:
 
**Download Ollama CLI from**  [**Ollama**](https://ollama.com/download)

**Pull a model**
```bash 
ollama pull 'modle_name'
```
---
### Configuartion
Go to settings and search setting or edit JSON file

**Json**
```json
"ollama.giveContext": true,
"ollama.modelName": "give model name",
"ollama.prompt": "give you own prompt",
"ollama.serverURL": "http://127.0.0.1:11434",
```
**Settings**

Head to setting and search **Ollama** 

- **server Url** : Default localhost portnumber 114343 is considered, if needed can be changed here.

- **GiveContext** : If set to true take whole file content into consideration

- **Model Name** : If no model name is Given, prompt to select a model from all install models.

- **Prompt** : A Default prompt is used, if necessary you can give your own. {language} is replaced with the language of the current document 

---

### Commads

- Select the code that you want to be commented. 

- Go to **command** ( ``` ctrl + P ``` ) and select Generate comments.

- Select the **model**, if asked.

- Comments will be generated a line above the selected code.
