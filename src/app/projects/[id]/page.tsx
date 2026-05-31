"use client";

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { TaskColumn } from "@/components/ui/task-column";
import {
    DndContext,
    DragEndEvent,
} from "@dnd-kit/core";

type Project = {
    id: number
    name: string
    status: string
    note: string
    members: { id: number; name: string }[]
}

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

export default function ProjectPage() {
    const params = useParams();
    const projectId = params.id;
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`/api/projects?id=${projectId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProject(data.projects[0]);
                } else {
                    console.error("Failed to fetch project:", response.status, response);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        } fetchProject();
    }, [projectId]);

    useEffect(() => {
        async function fetchTasks() {
            try {
                if (!projectId) {
                    console.error("Project ID is missing"); return;
                } const response = await fetch(`/api/tasks?projectId=${projectId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data.tasks);
                } else {
                    console.error("Failed to fetch tasks:", response.status, response);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        } fetchTasks();

    }, [projectId]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const taskId = active.id;
            const newStatus = over?.id as string;

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );

            fetch(`/api/tasks`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, status: newStatus })
            }).then((response) => {
                if (!response.ok) {
                    console.error("Failed to update task status:", response.status, response);
                }
            }).catch((error) => {
                console.error("Error updating task status:", error);
            });
        }
    }

    const columns = {
        "not started": tasks.filter((t) => t.status === "not started"),
        "in progress": tasks.filter((t) => t.status === "in progress"),
        completed: tasks.filter((t) => t.status === "completed"),
    };

    return (
        <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-4 md:gap-8 md:py-6 lg:px-6">
            <Card className="w-full">
                <CardHeader className="space-y-2">
                    <Badge variant="outline" className="w-fit rounded-full">
                        <Sparkles className="mr-1 size-3.5" />
                        {project?.status || "Loading..."}
                    </Badge>
                    <h1 className="text-3xl font-semibold">
                        {project?.name || "Loading..."}
                    </h1>
                    <CardDescription className="max-w-2xl text-base leading-7">
                        {project?.note || "Loading project details..."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DndContext onDragEnd={handleDragEnd}>
                        <div className="grid gap-4 md:grid-cols-3">
                                {Object.entries(columns).map(
                                    ([status, columnTasks]) => (
                                        <TaskColumn
                                            key={status}
                                            status={status}
                                            tasks={columnTasks}
                                        />
                                    )
                                )}
                        </div>
                    </DndContext>
                </CardContent>
            </Card>
        </div>);
}