export interface Project {
    id: number;
    name: string;
    publishTime: string;
    applicationDate?: string | null;
    projectLeader?: string | null;
    type: number;
    teacher: string;
    college: string;
    specialist?: number | null;
    status: number;
}
