import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    for (const m in container) {
        let disposable = vscode.commands.registerCommand(`vs-logger.${m}`, container[m]);
        context.subscriptions.push(disposable);
    }
}

interface methodContainer {
    [propName: string]: () => void;
}
const container = {} as methodContainer;
["logSelection", "errorSelection", "warnSelection"].map((method) => {
    const option = `console.${method.slice(0, -9)}`;
    container[method] = () => {
        const textContent = getSelectedText(option);
        writeFile(textContent);
    };
});

function getSelectedText(option: string): string[] {
    const editor = vscode.window.activeTextEditor;
    const textContent = [] as string[];

    const ranges = editor?.selections;
    ranges?.forEach((r) => {
        const text = editor?.document.getText(r);
        let str = text ? `${option}(${JSON.stringify(text + ":")}, ${text});` : `${option}()`;
        textContent.push(str);
    });

    return textContent;
}

function writeFile(textContent: string[]) {
    vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const ranges = editor.selections;
        const positions = [] as vscode.Position[];
        ranges.forEach((r) => {
            const position = new vscode.Position(r.start.line, r.start.character);
            positions.push(position);
        });
        editor.edit((handler) => {
            positions.forEach((position, index) => {
                handler.insert(position, textContent[index]);
            });
        });
    });
}

export function deactivate() {}
