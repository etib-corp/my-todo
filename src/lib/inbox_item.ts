import { prisma } from "@/lib/prisma";

export interface InboxItemsListingParams {
	id?: number;
	category?: string;
	userId?: number;
}

export interface InboxItemCreationParams {
	title: string;
	description: string;
	category: string;
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
            connect: { id: input.userId },
        },
    };

	return prisma.inboxItem.create({ data });
}
