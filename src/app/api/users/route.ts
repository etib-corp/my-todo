import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
	createUser,
	deleteUser,
	updateUserStatus,
	listUsers,
	UsersListingParams,
	UserCreationParams,
} from "@/lib/back/user";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const idParam = searchParams.get("id");
	const nameParam = searchParams.get("name");
	const statusParam = searchParams.get("status");
	const tasksParam = searchParams.get("tasks");
	const projectsParam = searchParams.get("projects");

	const listingParams: UsersListingParams = {
		id: idParam ? parseInt(idParam) : undefined,
		name: nameParam ?? undefined,
		status: statusParam ?? undefined,
		tasks: tasksParam ? tasksParam.split(",").map(Number) : undefined,
		projects: projectsParam ? projectsParam.split(",").map(Number) : undefined,
	};

	const users = await listUsers(listingParams);

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
	if (!data.email) {
		return NextResponse.json(
			{ error: "User email is required" },
			{ status: 400 },
		);
	}
	if (!data.password) {
		return NextResponse.json(
			{ error: "User password is required" },
			{ status: 400 },
		);
	}

	data.password = await bcrypt.hash(data.password, process.env.PASSWORD_SALT!);
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

	const { userId, status } = payload;

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