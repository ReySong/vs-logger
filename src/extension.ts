import * as vscode from "vscode";
import { MethodContainer } from "./type";
import { getSelectedText, editFile, clearConsole } from "./utils";

const customOptionMap = new Map<string, string>();
const customCbs = vscode.workspace.getConfiguration().get("vs-logger");
for (const key in customCbs as any) {
    const option = (customCbs as any)[key];
    switch (key) {
        case "consoleLog":
            customOptionMap.set("console.log", option);
            break;
        case "consoleError":
            customOptionMap.set("console.error", option);
            break;
        case "consoleWarn":
            customOptionMap.set("console.warn", option);
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
        const disposable = vscode.commands.registerCommand(`vs-logger.${m}`, methodContainer[m]);
        context.subscriptions.push(disposable);
    }
    context.subscriptions.push(
        vscode.commands.registerCommand("vs-logger.clearAllLog", () =>
            clearConsole({
                log: true,
            })
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("vs-logger.clearAllErrors", () =>
            clearConsole({
                error: true,
            })
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("vs-logger.clearAllWarnings", () =>
            clearConsole({
                warn: true,
            })
        )
    );
    context.subscriptions.push(vscode.commands.registerCommand("vs-logger.clear", clearConsole));
}
