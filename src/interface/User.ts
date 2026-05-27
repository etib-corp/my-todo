import { Project } from "./Project";
import { Task } from "./Task";
import { Team } from "./Team";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    subTeam: string;
    status: string;
    team?: Team;
    teamId?: number;
    tasks: Task[];
    projects: Project[];
}
