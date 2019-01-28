export declare let unirestWrapper: <T extends {
    [key: string]: any;
}>(unirest: T) => T;
export declare let requestWrapper: <T extends {
    [key: string]: any;
}>(request: T) => T;
export declare let getInjectHeaders: () => {
    'uber-trace-id': string;
};
