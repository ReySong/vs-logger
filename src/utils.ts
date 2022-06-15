import * as vscode from "vscode";
import { clearOption, clearCnt } from "./type";
import { State } from "./enums";

export function getSelectedText(option: string): string[] {
    const editor = vscode.window.activeTextEditor;
    const textContent = [] as string[];
    const ranges = editor?.selections;
    ranges?.forEach((r) => {
        const text = editor?.document.getText(r);
        let str = text ? `${option}(${JSON.stringify(text + ":")}, ${text});` : `${option}();`;
        textContent.push(str);
    });
    return textContent;
}

export function editFile(textContent: string[]) {
    const editor = vscode.window.activeTextEditor;
    vscode.commands.executeCommand("editor.action.insertLineAfter").then(() => {
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

export function clearConsole(
    options: clearOption = {
        log: true,
        error: true,
        warn: true,
    }
) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const deleteOption = "";
    const reg: RegExp = /console.(log|error|warn)\(/gi;
    const cnt: clearCnt = {
        logCnt: 0,
        errorCnt: 0,
        warnCnt: 0,
    };

    const ranges = [] as vscode.Range[];

    let matchText;
    while ((matchText = reg.exec(text))) {
        const lastIndex = reg.lastIndex;
        const range = new vscode.Range(document.positionAt(matchText.index), document.positionAt(lastIndex));

        if (!range.isEmpty) {
            ranges.push(range);
        }
    }

    editor
        .edit((handler) => {})
        .then(() => {
            let str = "";
            for (const key in cnt) {
                if (cnt[key]) {
                    str += `${cnt[key]} console.${key} deleted\n`;
                }
            }
            vscode.window.showInformationMessage(str.slice(0, -2));
        });
}
