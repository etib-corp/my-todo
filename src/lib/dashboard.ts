import { prisma } from "@/lib/prisma";

export async function getOverviewData() {
    const [totalTasks, completedTaskRows, inboxCount, recentTasks] = await Promise.all([
        prisma.task.count(),
        prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*) AS count
            FROM "Task"
            WHERE status = 'completed'
        `,
        prisma.inboxItem.count(),
        prisma.$queryRaw<
            {
                id: number;
                title: string;
                details: string | null;
                status: string;
            }[]
        >`
            SELECT id, title, details, status
            FROM "Task"
            ORDER BY id DESC
            LIMIT 5
        `,
    ]);

    return {
        totalUsers: 0,
        totalTasks,
        completedTasks: Number(completedTaskRows[0]?.count ?? 0),
        inboxCount,
        recentTasks: recentTasks.map((task) => ({
            ...task,
            completed: task.status === 'completed',
        })),
    };
}

export async function listProjects() {
    return prisma.project.findMany({
        select: {
            id: true,
            name: true,
            status: true,
            note: true,
        },
    });
}

export async function createProject(data: {
    name: string;
    status: string;
    note: string;
    memberIds?: number[];
}) {
    return prisma.project.create({
        data: {
            name: data.name,
            status: data.status,
            note: data.note,
            members: data.memberIds?.length
                ? { connect: data.memberIds.map((id) => ({ id })) }
                : undefined,
        },
        select: {
            id: true,
            name: true,
            status: true,
            note: true,
            createdAt: true,
        },
    });
}

export async function listUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            subTeam: true,
            status: true,
        },
        orderBy: { id: "desc" },
    });
}

export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    subTeam: string;
    status: string;
}) {
    return prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            subTeam: true,
            status: true,
        },
    });
}