import * as vscode from "vscode";
import { ClearCnt } from "./type";
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

function isQuotationMark(char: string): boolean {
    return char === "`" || char === "'" || char === '"';
}

function isText(char: string): boolean {
    return /[^()'"`;]/.test(char);
}

function shouldJumpToEnd(stk: string[], char: string): boolean {
    if (stk[stk.length - 1] === "(" && char === ")") {
        stk.pop();
    }
    return stk.length === 0;
}

function parse(start: number): number | null {
    const document = vscode.window.activeTextEditor?.document;
    if (!document) return null;
    let currentState: State = State.bracketOpen;
    let endIndex = start;
    const bracketsStk = ["("];
    while (currentState !== State.bracketEnd) {
        const startPosition = document.positionAt(endIndex);

        let text = document.getText(
            new vscode.Range(startPosition.line, startPosition.character, startPosition.line + 1, 0)
        );
        let preQuotationMark: string = "";
        for (const char of text) {
            switch (currentState) {
                case State.bracketOpen:
                    if (char === ")" && shouldJumpToEnd(bracketsStk, char)) currentState = State.bracketEnd;
                    else if (isQuotationMark(char)) {
                        currentState = State.stringStart;
                        preQuotationMark = char;
                    } else if (isText(char)) currentState = State.text;
                    break;
                case State.stringStart:
                    if (isQuotationMark(char) && preQuotationMark === char) {
                        currentState = State.stringEnd;
                        preQuotationMark = "";
                    }
                    break;
                case State.text:
                    if (char === ",") currentState = State.comma;
                    else if (char === ")" && shouldJumpToEnd(bracketsStk, char)) currentState = State.bracketEnd;
                    if (char === "(") bracketsStk.push("(");
                    break;
                case State.comma:
                    if (isQuotationMark(char)) {
                        currentState = State.stringStart;
                        preQuotationMark = char;
                    } else if (isText(char)) {
                        currentState = State.text;
                    }
                    break;
                case State.stringEnd:
                    if (char === ",") currentState = State.comma;
                    else if (char === ")" && shouldJumpToEnd(bracketsStk, char)) currentState = State.bracketEnd;
                    break;
            }
            ++endIndex;
            if (currentState === State.bracketEnd) break;
        }
    }

    const curPosition = document.positionAt(endIndex);
    const nextPosition = document.positionAt(endIndex + 1);
    let nextChar = document.getText(new vscode.Range(curPosition, nextPosition));

    return nextChar === ";" ? endIndex + 1 : endIndex;
}

export function clearConsole(
    cnt: ClearCnt = {
        ["console.log"]: 0,
    }
) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    let regStr = "";
    for (const key in cnt) {
        regStr = regStr + key + "\\(|";
    }
    regStr = regStr.slice(0, -1);
    const reg: RegExp = new RegExp(regStr, "g");
    const ranges = [] as vscode.Range[];
    let matchText;
    while ((matchText = reg.exec(text))) {
        const lastIndex = parse(matchText.index + matchText[0].length);
        if (!lastIndex) break;
        const range = new vscode.Range(document.positionAt(matchText.index), document.positionAt(lastIndex));
        if (!range.isEmpty) {
            ranges.push(range);
            ++cnt.log;
        }
    }

    editor
        .edit((handler) => {
            ranges.forEach((range) => {
                handler.replace(range, "");
            });
        })
        .then(() => {
            let str = "";
            for (const key in cnt) {
                if (cnt[key]) {
                    str += `${cnt[key]} ${key} deleted\n`;
                }
            }
            vscode.window.showInformationMessage(str.slice(0, -2));
        });
}
