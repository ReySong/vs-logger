export interface MethodContainer {
    [propName: string]: () => void;
}
export interface clearOption {
    log?: boolean;
    error?: boolean;
    warn?: boolean;
}
export interface clearCnt {
    logCnt: number;
    errorCnt: number;
    warnCnt: number;
    [customCnt: string]: number;
}
