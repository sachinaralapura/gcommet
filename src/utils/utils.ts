import * as vscode from "vscode";
import { ErrorType, MyError } from "./type";



export function getConfiguration<T>(section: string, defaultValue: any = "", setting: string = "ollama"): T {
    const config = vscode.workspace.getConfiguration(setting);
    return config.get<T>(section, defaultValue);
}

export function handleError(error: any) {
    if (error?.name === "FetchError") {
        vscode.window.showErrorMessage(`Fetch Error : make sure ollama server is running`);
    } else if (error?.type === ErrorType.ERROR) {
        vscode.window.showErrorMessage(error?.message);
    }
    else if (error?.type === ErrorType.WARNING) {
        vscode.window.showWarningMessage(error?.message);
    } else {
        vscode.window.showInformationMessage(error?.message);
    }
}

export { ErrorType, MyError };

