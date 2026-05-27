import { Task } from "./Task";
import { User } from "./User";

export interface Project {
    id: number;
    name: string;
    status: string;
    members: User[];
    note: string;
    createdAt: Date;
    updatedAt: Date;
    tasks: Task[];
}
