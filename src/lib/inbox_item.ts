import { prisma } from "@/lib/prisma";

import { User } from "@/interface/User";
import { Project } from "@/interface/Project";
import { Team } from "@/interface/Team";
import { Task } from "@/interface/Task";

interface InboxItemsListingParams {
	id?: number;
	category?: string;
	userId?: number;
}

interface InboxItemCreationParams {
	title: string;
	description: string;
	category: string;
	user: User;
	href?: string;
    userId: number;
}

export async function listInboxItems(params: InboxItemsListingParams) {
	const where: any = {};

	if (params.id !== undefined) {
		where.id = params.id;
	}

	if (params.category !== undefined) {
		where.category = params.category;
	}

	if (params.userId !== undefined) {
		where.userId = params.userId;
	}

	return prisma.inboxItem.findMany({ where, orderBy: { id: "desc" } });
}

export async function deleteInboxItem(id: number) {
	return prisma.inboxItem.delete({
		where: { id },
	});
}

export async function createInboxItem(input: InboxItemCreationParams) {
	const data: any = {
        title: input.title,
        description: input.description,
        category: input.category,
        href: input.href,
        userId: input.userId,
        user: {
            connect: { id: input.user.id },
        },
    };

	return prisma.inboxItem.create({ data });
}
