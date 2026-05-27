import { prisma } from "@/lib/prisma";

import { User } from "@/interface/User";
import { Project } from "@/interface/Project";
import { Team } from "@/interface/Team";
import { Task } from "@/interface/Task";
import { JsonNullClass } from "@prisma/client/runtime/client";

interface UsersListingParams {
	id?: number;
	name?: string;
	email?: string;
	subTeam?: string;
	status?: string;
	team?: Team;
	teamId?: number;
	tasks?: Task[];
	projects?: Project[];
}

interface UserCreationParams {
	name: string;
	email: string;
	password: string;
	subTeam: string;
	status: string;
	team?: Team;
	teamId?: number;
	tasks: Task[];
	projects: Project[];
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

	if (params.team !== undefined) {
		where.teamId = params.team.id;
	}

	if (params.teamId !== undefined) {
		where.teamId = params.teamId;
	}

	if (params.tasks !== undefined) {
		where.tasks = {
			some: {
				id: { in: params.tasks.map((task) => task.id) },
			},
		};
	}

	if (params.projects !== undefined) {
		where.projects = {
			some: {
				id: { in: params.projects.map((project) => project.id) },
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
			connect: input.tasks.map((task) => ({ id: task.id })),
		},
		projects: {
			connect: input.projects.map((project) => ({ id: project.id })),
		},
	};

	if (input.team) {
		data.team = { connect: { id: input.team.id } };
    data.teamId = input.team.id;
	} else if (input.teamId !== undefined) {
		data.teamId = input.teamId;
    data.team = { connect: { id: input.teamId } };
	}

	return prisma.user.create({ data });
}
