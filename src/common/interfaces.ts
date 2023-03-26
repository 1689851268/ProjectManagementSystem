export interface Configuration {
    name: string;
    defaultVal: string | number;
    type: string;
    clearable?: boolean;
    options?: { label: string; value: number }[];
    [propName: string]: any;
}

export interface MetaData {
    id: number;
    name: string;
}
