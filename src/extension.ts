import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log(123);
    console.log(vscode.window.activeTextEditor?.selections);
    let disposable = vscode.commands.registerCommand("vs-logger.logSelection", logSelection);

    context.subscriptions.push(disposable);
}

function logSelection() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    const textContent = [] as string[];
    const ranges = editor.selections;
    ranges.forEach((r) => {
        const text = editor.document.getText(r);
        let str = text ? `console.log(${JSON.stringify(text + ":")}, ${text});` : "console.log";
        textContent.push(str);
    });

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
