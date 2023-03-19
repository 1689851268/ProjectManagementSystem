export interface Notification {
    title: string;
    content: string;
    time: string;
}

export interface Configuration {
    name: string;
    defaultVal: string;
    type: string;
    [propName: string]: any;
}
