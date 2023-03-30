export interface rawProject {
    id: number;
    name: string;
    publishTime: string;
    applicationDate: string;
    projectLeader: string | null;
    type: number;
    teacher: string;
    college: string;
    specialist: string | null;
    status: number;
}

// 将 rawProject 转换为 Project;  将 status 和 type 转为 string
export type Project = Omit<rawProject, 'status' | 'type'> & {
    status: string;
    type: string;
};

export interface ProjectForm {
    name: string;
    type: string;
    description: string;
    id: number;
}
