export interface Task {
    id: number;
    title: string;
    details: string;
    project: number;
    assignedTo: number[];
    status: string;
    note: string;
    dueDate: string;
}
