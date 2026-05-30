import { NextRequest, NextResponse } from "next/server";
import {
	listProjects,
	createProject,
	deleteProject,
	addMemberToProject,
	removeMemberFromProject,
	addTaskToProject,
	removeTaskFromProject,
	updateProjectStatus,
	updateProjectNote,
	ProjectListingParams,
	ProjectCreationParams,
} from "@/lib/back/project";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const idParam = searchParams.get("id");
	const nameParam = searchParams.get("name");
	const statusParam = searchParams.get("status");
	const membersParam = searchParams.get("members");
	const updatedAtParam = searchParams.get("updatedAt");

	const listingParams: ProjectListingParams = {
		id: idParam ? parseInt(idParam) : undefined,
		name: nameParam ?? undefined,
		status: statusParam ?? undefined,
		members: membersParam ? membersParam.split(",").map(Number) : undefined,
		updatedAt: updatedAtParam ? new Date(updatedAtParam) : undefined,
	};

	const projects = await listProjects(listingParams);

	return NextResponse.json({ projects });
}

export async function POST(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		name?: string;
		status?: string;
		members?: number[];
		note?: string;
		tasks?: number[];
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const data: ProjectCreationParams = {
		name: payload.name ?? "",
		status: payload.status ?? "pending",
		members: payload.members ?? [],
		note: payload.note ?? "",
		tasks: payload.tasks ?? [],
	};

	if (!data.name) {
		return NextResponse.json(
			{ error: "Project name is required" },
			{ status: 400 },
		);
	}

	const project = await createProject(data);

	return NextResponse.json({ project });
}

export async function PATCH(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		projectId?: number;
		removeMemberId?: number;
		addMemberId?: number;
		addTaskId?: number;
		removeTaskId?: number;
		status?: string;
		note?: string;
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const {
		projectId,
		removeMemberId,
		addMemberId,
		addTaskId,
		removeTaskId,
		status,
		note,
	} = payload;

	if (!projectId) {
		return NextResponse.json(
			{ error: "Project ID is required" },
			{ status: 400 },
		);
	}

	if (removeMemberId) {
		await removeMemberFromProject(projectId, removeMemberId);
	}

	if (addMemberId) {
		await addMemberToProject(projectId, addMemberId);
	}

	if (addTaskId) {
		await addTaskToProject(projectId, addTaskId);
	}

	if (removeTaskId) {
		await removeTaskFromProject(projectId, removeTaskId);
	}

	if (status !== undefined) {
		await updateProjectStatus(projectId, status);
	}

	if (note !== undefined) {
		await updateProjectNote(projectId, note);
	}

	return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		projectId?: number;
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const { projectId } = payload;

	if (!projectId) {
		return NextResponse.json(
			{ error: "Project ID is required" },
			{ status: 400 },
		);
	}

	await deleteProject(projectId);

	return NextResponse.json({ success: true });
}