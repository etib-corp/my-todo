"use client"

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";

type Task = {
    id: number
    createdAt: Date
    details: string
    dueDate: Date
    note: string
    projectId: number
    status: string
    title: string
    updatedAt: Date
}

export function TaskCard({ task }: { task: Task }) {
    const { attributes, listeners, setNodeRef, transform } =
        useDraggable({
            id: task.id,
            data: {
                task,
            },
        });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab"
        >
            <CardContent>
                <h3 className="font-medium">
                    {task.title}
                </h3>

                <p className="text-muted-foreground text-sm mt-1">
                    {task.note}
                </p>
                <CardDescription>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    <br />
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                    <br />
                    Details: {task.details}
                </CardDescription>
            </CardContent>
        </Card>
    );
}