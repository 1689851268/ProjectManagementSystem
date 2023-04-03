export interface RawInvolvedProject {
    id: number;
    name: string;
    publishTime: string;
    applicationDate: string;
    projectLeader: {
        id: number;
        name: string;
    };
    teacher: {
        id: number;
        name: string;
        college: {
            id: number;
            name: string;
        };
    };
    specialist?: {
        id: number;
        name: string;
    };
    status: {
        id: number;
        name: string;
    };
    type: {
        id: number;
        name: string;
    };
}

export interface InvolvedProject {
    id: number;
    name: string;
    publishTime: string;
    applicationDate: string;
    projectLeader: string;
    college: string;
    teacher: string;
    specialist: string;
    status: string;
    type: string;
}
