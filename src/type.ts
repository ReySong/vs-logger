export interface MethodContainer {
    [propName: string]: () => void;
}
export interface clearOption {
    [customOption: string]: string;
}
export interface clearCnt {
    logCnt: number;
    [customCnt: string]: number;
}
