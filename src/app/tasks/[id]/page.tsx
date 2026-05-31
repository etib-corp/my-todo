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
						<p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
						<p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
						<p>Note:</p>
						<p>{task.note}</p>
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
						<div className="grid gap-2 rounded-2xl border bg-muted/20 p-3 text-sm text-muted-foreground">
							<span className="flex items-center gap-2 text-foreground">
								<Clock3Icon className="size-4" />
								Default to today
							</span>
							<span>
								Use this for tasks that should land in the current workstream.
							</span>
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
