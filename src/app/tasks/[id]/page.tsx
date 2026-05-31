"use client";

import { useParams, useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Clock3Icon, Sparkles } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { Project } from "@/generated/prisma/browser";

type Task = {
	id: number;
	createdAt: Date;
	details: string;
	dueDate: Date;
	note: string;
	projectId: number;
	status: string;
	title: string;
	updatedAt: Date;
};

export default function TaskPage() {
	const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);

	const router = useRouter();

	const params = useParams();
	const taskId = params.id;
	const [task, setTask] = useState<Task | null>(null);
	const statuses = ["not started", "in progress", "completed"];

	const [taskDetails, setTaskDetails] = useState("");
	const [project, setProject] = useState<Project | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		async function fetchTask() {
			try {
				const response = await fetch(`/api/tasks?id=${taskId}`);
				if (response.ok) {
					const data = await response.json();
					setTask(data.tasks[0]);
					setTaskDetails(data.tasks[0].note);
				} else {
					console.error("Failed to fetch task:", response.status, response);
				}
			} catch (error) {
				console.error("Error fetching task:", error);
			}
		}

		async function fetchProject() {
			try {
				const response = await fetch(`/api/projects?id=${task?.projectId}`);
				if (response.ok) {
					const data = await response.json();
					setProject(data.projects[0]);
				} else {
					console.error("Failed to fetch project:", response.status, response);
				}
			} catch (error) {
				console.error("Error fetching project:", error);
			}
		}

		async function fetchProjects() {
			try {
				const response = await fetch(`/api/projects`);
				if (response.ok) {
					const data = await response.json();
					setProjects(data.projects);
				} else {
					console.error("Failed to fetch projects:", response.status, response);
				}
			} catch (error) {
				console.error("Error fetching projects:", error);
			}
		}

		fetchProjects();

		if (task?.projectId) {
			fetchProject();
		}
		fetchTask();
	}, [taskId]);

	if (!task) {
		return <div>Loading...</div>;
	}

	function closeQuickCreate() {
		setIsEditDetailsOpen(false);
		setTaskDetails("");
	}

	async function handleEditDetails(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const details = taskDetails.trim();

		const response = await fetch("/api/tasks", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				taskId: task?.id,
				note: details,
				projectId: project?.id,
			}),
		});

		if (!response.ok) {
			toast.error("Could not save the task");
			return;
		}

		toast.success(`Task updated`);
		closeQuickCreate();
		router.refresh();
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
					: null,
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
				<CardContent className="flex flex-col items-start gap-4">
					<div className="text-sm text-muted-foreground">
						<p>Project: {project?.name || "Loading..."}</p>
						<p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
						<p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
						<Button
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={() => setIsEditDetailsOpen(true)}
						>
							Edit Details
						</Button>
					</div>
					<Select value={task.status} onValueChange={updateTaskStatus}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							{statuses.map((status) => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<Dialog open={isEditDetailsOpen} onOpenChange={setIsEditDetailsOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Details</DialogTitle>
						<DialogDescription>
							Update the details for this task.
						</DialogDescription>
					</DialogHeader>
					<form className="grid gap-4" onSubmit={handleEditDetails}>
						<div className="grid gap-2">
							<Label htmlFor="details">Details</Label>
							<Input
								id="details"
								placeholder="Add context, owner, or a due date"
								value={taskDetails}
								onChange={(event) => setTaskDetails(event.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="project">Project</Label>
							<Select
								value={project?.name || ""}
								onValueChange={(value) => {
									const selectedProject =
										projects.find((p) => p.name === value) || null;
									setProject(selectedProject);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a project" />
								</SelectTrigger>
								<SelectContent>
									{projects.map((project) => (
										<SelectItem key={project.id} value={project.name}>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={closeQuickCreate}
							>
								Cancel
							</Button>
							<Button type="submit">Save Changes</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
