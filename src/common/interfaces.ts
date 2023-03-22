export interface Configuration {
    name: string;
    defaultVal: string;
    type: string;
    options?: { label: string; value: number }[];
    [propName: string]: any;
}

export interface MetaData {
    id: number;
    name: string;
}
