export interface Configuration {
    name: string;
    defaultVal: string;
    type: string;
    [propName: string]: any;
}

export interface MetaData {
    id: number;
    name: string;
}
