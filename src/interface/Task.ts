import { Project } from "./Project";
import { User } from "./User";

export interface Task {
    id: number;
    title: string;
    details: string;
    project: Project;
    assignedTo: User[];
    status: string;
    note: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
    projectId: number;
}
