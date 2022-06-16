export interface MethodContainer {
    [propName: string]: () => void;
}
export interface ClearCnt {
    ["console.log"]: number;
    [customCnt: string]: number;
}
