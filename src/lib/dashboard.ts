import { prisma } from "@/lib/prisma";

export async function getOverviewData() {
    const [totalTasks, completedTaskRows, inboxCount, recentTasks] = await Promise.all([
        prisma.task.count(),
        prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*) AS count
            FROM "Task"
            WHERE completed = 1
        `,
        prisma.inboxItem.count(),
        prisma.$queryRaw<
            {
                id: number;
                title: string;
                details: string | null;
                completed: number;
            }[]
        >`
            SELECT id, title, details, completed
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
            completed: Boolean(task.completed),
        })),
    };
}