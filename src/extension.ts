import * as vscode from "vscode";
import { MethodContainer } from "./type";
import { getSelectedText, editFile, clearConsole } from "./utils";

const customOptionMap = new Map<string, string>();
const customCbs = vscode.workspace.getConfiguration().get("vsc-logger");
for (const key in customCbs as any) {
    const option = (customCbs as any)[key] as string;
    switch (key) {
        case "consoleLog":
            option !== "" && customOptionMap.set("console.log", option);
            break;
        case "consoleError":
            option !== "" && customOptionMap.set("console.error", option);
            break;
        case "consoleWarn":
            option !== "" && customOptionMap.set("console.warn", option);
            break;
    }
}

const methodContainer = {} as MethodContainer;
["logSelection", "errorSelection", "warnSelection"].map((method) => {
    let option = `console.${method.slice(0, -9)}`;
    if (customOptionMap.has(option)) option = customOptionMap.get(option)!;
    methodContainer[method] = () => {
        editFile(getSelectedText(option));
    };
});

export function activate(context: vscode.ExtensionContext) {
    for (const m in methodContainer) {
        const disposable = vscode.commands.registerCommand(`vsc-logger.${m}`, methodContainer[m]);
        context.subscriptions.push(disposable);
    }
    context.subscriptions.push(vscode.commands.registerCommand("vsc-logger.clear", clearConsole));
}
