import { NextResponse } from "next/server";

import {
	createTask,
	listTasks,
	updateTaskStatus,
	updateTaskDueDate,
  updateTaskNote,
  removeAssignedFromTask,
  deleteTask,
  addAssignedToTask,
  TasksListingParams,
  TaskCreationParams
} from "@/lib/task";

export async function GET(params: URLSearchParams) {
  const idParam = params.get("id");
  const projectIdParam = params.get("projectId");
  const assignedToParam = params.get("assignedTo");
  const statusParam = params.get("status");
  const noteParam = params.get("note");
  const dueDateParam = params.get("dueDate");
  const createdAtParam = params.get("createdAt");
  const updatedAtParam = params.get("updatedAt");

  const searchParams: TasksListingParams = {
    id: idParam ? parseInt(idParam) : undefined,
    projectId: projectIdParam ? parseInt(projectIdParam) : undefined,
    assignedTo: assignedToParam
      ? assignedToParam.split(",").map((id) => parseInt(id))
      : undefined,
    status: statusParam ?? undefined,
    note: noteParam ?? undefined,
    dueDate: dueDateParam ? new Date(dueDateParam) : undefined,
    createdAt: createdAtParam ? new Date(createdAtParam) : undefined,
    updatedAt: updatedAtParam ? new Date(updatedAtParam) : undefined,
  };

	const tasks = await listTasks(searchParams);

	return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
    title?: string
    details?: string
    projectId?: number
    assignedTo?: number[]
    status?: string
    note?: string
    dueDate?: Date
  } | null;

	if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const data: TaskCreationParams = {
    title: payload.title ?? "",
    details: payload.details ?? "",
    projectId: payload.projectId ?? 0,
    assignedTo: payload.assignedTo ?? [],
    status: payload.status ?? "pending",
    note: payload.note ?? "",
    dueDate: payload.dueDate ? new Date(payload.dueDate) : new Date(),
  }

	if (!data.title) {
		return NextResponse.json(
			{ error: "Task title is required" },
			{ status: 400 },
		);
	}

  if (!data.projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 },
    );
  }

	const task = await createTask(data);

	return NextResponse.json({ task });
}

export async function PATCH(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    taskId?: number
    status?: string
    note?: string
    dueDate?: Date
    removeAssignedUserId?: number
    addAssignedUserId?: number
  } | null;

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { taskId, status, note, dueDate, removeAssignedUserId, addAssignedUserId } = payload;

  if (!taskId) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 },
    );
  }

  if (status) {
    await updateTaskStatus(taskId, status);
  }

  if (note) {
    await updateTaskNote(taskId, note);
  }

  if (dueDate) {
    await updateTaskDueDate(taskId, new Date(dueDate));
  }

  if (removeAssignedUserId) {
    await removeAssignedFromTask(taskId, removeAssignedUserId);
  }

  if (addAssignedUserId) {
    await addAssignedToTask(taskId, addAssignedUserId);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    taskId?: number
  } | null;

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { taskId } = payload;

  if (!taskId) {
    return NextResponse.json(
      { error: "Task ID is required" },
      { status: 400 },
    );
  }

  await deleteTask(taskId);

  return NextResponse.json({ success: true });
}
