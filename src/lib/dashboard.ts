import { prisma } from "@/lib/prisma"

const seedTasks = [
  {
    title: "Review onboarding handoff",
    details: "Check the latest copy and release timeline before lunch.",
    completed: false,
  },
  {
    title: "Draft async status update",
    details: "Summarize the blockers that are still waiting on review.",
    completed: true,
  },
  {
    title: "Prep project sync notes",
    details: "Capture decisions for the afternoon team sync.",
    completed: false,
  },
]

const seedInboxItems = [
  {
    title: "Design review requested",
    description: "Ava needs a quick pass on the onboarding handoff.",
    category: "Review",
  },
  {
    title: "Standup starting soon",
    description: "Team sync is queued for 14:30 with product and ops.",
    category: "Meeting",
  },
  {
    title: "Blocker cleared",
    description: "Maya resolved the planning board sync issue.",
    category: "Update",
  },
]

const seedProjects = [
  {
    name: "Onboarding refresh",
    status: "In progress",
    owner: "Ava",
    note: "Waiting on copy and final QA.",
  },
  {
    name: "Team planning flow",
    status: "Review",
    owner: "Maya",
    note: "Needs a decision on the release window.",
  },
  {
    name: "Ops automation",
    status: "Planned",
    owner: "Leila",
    note: "Ready to start after this sprint.",
  },
]

async function seedWorkspaceData() {
  const [taskCount, inboxCount, projectCount] = await Promise.all([
    prisma.task.count(),
    prisma.inboxItem.count(),
    prisma.project.count(),
  ])

  await Promise.all([
    taskCount === 0 ? prisma.task.createMany({ data: seedTasks }) : Promise.resolve(),
    inboxCount === 0
      ? prisma.inboxItem.createMany({ data: seedInboxItems })
      : Promise.resolve(),
    projectCount === 0
      ? prisma.project.createMany({ data: seedProjects })
      : Promise.resolve(),
  ])
}

export async function getOverviewData() {
  await seedWorkspaceData()

  const [totalTasks, completedTasks, inboxCount, activeProjects, recentTasks] =
    await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { completed: true } }),
      prisma.inboxItem.count(),
      prisma.project.count(),
      prisma.task.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    ])

  return {
    totalTasks,
    completedTasks,
    inboxCount,
    activeProjects,
    recentTasks,
  }
}

export async function listProjects() {
  await seedWorkspaceData()

  return prisma.project.findMany({ orderBy: { updatedAt: "desc" } })
}

export async function listInboxItems() {
  await seedWorkspaceData()

  return prisma.inboxItem.findMany({ orderBy: { createdAt: "desc" } })
}

export async function createTask(input: { title: string; details: string }) {
  await seedWorkspaceData()

  return prisma.task.create({
    data: {
      title: input.title,
      details: input.details,
    },
  })
}