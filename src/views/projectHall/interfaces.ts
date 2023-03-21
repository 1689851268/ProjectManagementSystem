export interface Project {
    id: number;
    name: string;
    publishTime: string;
    applicationDate?: string | null;
    projectLeader?: string | null;
    type: number;
    teacher: number;
    college: number;
    specialist?: number | null;
    status: number;
}
