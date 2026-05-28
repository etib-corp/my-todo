import { NextResponse } from "next/server";

import {
	createUser,
	deleteUser,
	updateUserStatus,
	listUsers,
	UsersListingParams,
	UserCreationParams,
} from "@/lib/back/user";

export async function GET(params: URLSearchParams) {
	const idParam = params.get("id");
	const nameParam = params.get("name");
	const statusParam = params.get("status");
	const tasksParam = params.get("tasks");
	const projectsParam = params.get("projects");

	const searchParams: UsersListingParams = {
		id: idParam ? parseInt(idParam) : undefined,
		name: nameParam ?? undefined,
		status: statusParam ?? undefined,
		tasks: tasksParam ? tasksParam.split(",").map(Number) : undefined,
		projects: projectsParam ? projectsParam.split(",").map(Number) : undefined,
	};

	const users = await listUsers(searchParams);

	return NextResponse.json({ users });
}

export async function POST(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		name?: string;
		email?: string;
		password?: string;
		subTeam?: string;
		status?: string;
		teamId?: number;
		tasks?: number[];
		projects?: number[];
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const data: UserCreationParams = {
		name: payload.name ?? "",
		email: payload.email ?? "",
		password: payload.password ?? "",
		subTeam: payload.subTeam ?? "",
		status: payload.status ?? "pending",
		teamId: payload.teamId ?? undefined,
		tasks: payload.tasks ?? [],
		projects: payload.projects ?? [],
	};

	if (!data.name) {
		return NextResponse.json(
			{ error: "User name is required" },
			{ status: 400 },
		);
	}

	const user = await createUser(data);

	return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		userId?: number;
		status?: string;
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const {
		userId,
		status,
	} = payload;

	if (!userId) {
		return NextResponse.json(
			{ error: "User ID is required" },
			{ status: 400 },
		);
	}

	if (status !== undefined) {
		await updateUserStatus(userId, status);
	}

	return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
	const payload = (await request.json().catch(() => null)) as {
		userId?: number;
	} | null;

	if (!payload) {
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 },
		);
	}

	const { userId } = payload;

	if (!userId) {
		return NextResponse.json(
			{ error: "User ID is required" },
			{ status: 400 },
		);
	}

	await deleteUser(userId);

	return NextResponse.json({ success: true });
}
