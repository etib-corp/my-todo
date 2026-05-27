import { User } from "./User";

export interface Team {
    id: number;
    name: string;
    description: string;
    members: User[];
}
