export interface User {
    uuid: string;
    name: string;
    registerTime: string;
}

export interface UserInfo {
    identity: string;
    name: string;
    psw: string;
    pswAgain: string;
    phone: string | number;
    email: string;
    college: string;
    major: string;
    class: string | number;
}

export interface UserInfoState {
    uuid: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    college?: {
        id: number;
        name: string;
    };
    major?: {
        id: number;
        name: string;
    };
    class?: number;
}
