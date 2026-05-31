"use client";

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"; import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

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

export default function TaskPage() {
    const params = useParams();
    const taskId = params.id;
    const [task, setTask] = useState<Task | null>(null);
    const statuses = [
        "not started",
        "in progress",
        "completed",
    ];

    useEffect(() => {
        async function fetchTask() {
            try {
                const response = await fetch(`/api/tasks?id=${taskId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTask(data.tasks[0]);
                } else {
                    console.error("Failed to fetch task:", response.status, response);
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        } fetchTask();
    }, [taskId]);

    if (!task) {
        return <div>Loading...</div>;
    }

    async function updateTaskStatus(newStatus: string | null) {
        if (!newStatus) return;

        try {
            const response = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId: task?.id,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            setTask((prev) =>
                prev
                    ? {
                        ...prev,
                        status: newStatus,
                    }
                    : null
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
            <Card>
                <CardHeader>
                    <Badge variant="outline" className="w-fit rounded-full">
                        <Sparkles className="mr-1 size-3.5" />
                        {task.status || "Loading..."}
                    </Badge>
                    <h1 className="text-2xl font-bold">{task.title}</h1>
                    <CardDescription>{task.note}</CardDescription>

                </CardHeader>
                <CardContent>
                    <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                    <p>Details: {task.details}</p>
                    <Select
                        value={task.status}
                        onValueChange={updateTaskStatus}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {statuses.map((status) => (
                                <SelectItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>
    );
}