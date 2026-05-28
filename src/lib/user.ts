import { prisma } from "@/lib/prisma";

export interface UsersListingParams {
	id?: number;
	name?: string;
	email?: string;
	subTeam?: string;
	status?: string;
	teamId?: number;
	tasks?: number[];
	projects?: number[];
}

export interface UserCreationParams {
	name: string;
	email: string;
	password: string;
	subTeam: string;
	status: string;
	teamId?: number;
	tasks: number[];
	projects: number[];
}

export async function listUsers(params: UsersListingParams) {
	const where: any = {};

	if (params.id !== undefined) {
		where.id = params.id;
	}

	if (params.name !== undefined) {
		where.name = params.name;
	}

	if (params.email !== undefined) {
		where.email = params.email;
	}

	if (params.subTeam !== undefined) {
		where.subTeam = params.subTeam;
	}

	if (params.status !== undefined) {
		where.status = params.status;
	}

	if (params.teamId !== undefined) {
		where.teamId = params.teamId;
	}

	if (params.tasks !== undefined) {
		where.tasks = {
			some: {
				id: { in: params.tasks } ,
			},
		};
	}

	if (params.projects !== undefined) {
		where.projects = {
			some: {
				id: { in: params.projects } ,
			},
		};
	}

	if (params.status !== undefined) {
		where.status = params.status;
	}

	return prisma.user.findMany({ where, orderBy: { id: "asc" } });
}

export async function updateUserStatus(userId: number, status: string) {
	return prisma.user.update({
		where: { id: userId },
		data: { status },
	});
}

export async function deleteUser(userId: number) {
	return prisma.user.delete({
		where: { id: userId },
	});
}

export async function createUser(input: UserCreationParams) {
	const data: any = {
		name: input.name,
		email: input.email,
		password: input.password,
		subTeam: input.subTeam,
		status: input.status,
		tasks: {
			connect: input.tasks.map((taskId) => ({ id: taskId })),
		},
		projects: {
			connect: input.projects.map((projectId) => ({ id: projectId })),
		},
		teamId: input.teamId,
	};

	return prisma.user.create({ data });
}
