import { prisma } from "@/lib/prisma"

export interface TasksListingParams {
  id?: number
  projectId?: number
  assignedTo?: number[]
  status?: string
  note?: string
  dueDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface TaskCreationParams {
  title: string
  details: string
  projectId: number
  assignedTo: number[]
  status: string
  note: string
  dueDate: Date
}

export async function listTasks(params: TasksListingParams) {
  const where: any = {}

  if (params.id !== undefined) {
    where.id = params.id
  }

  if (params.projectId !== undefined) {
    where.projectId = params.projectId
  }

  if (params.assignedTo !== undefined) {
    where.assignedTo = {
      some: {
        id: { in: params.assignedTo },
      },
    }
  }

  if (params.status !== undefined) {
    where.status = params.status
  }

  if (params.note !== undefined) {
    where.note = params.note
  }

  if (params.dueDate !== undefined) {
    where.dueDate = params.dueDate
  }

  if (params.createdAt !== undefined) {
    where.createdAt = params.createdAt
  }

  if (params.updatedAt !== undefined) {
    where.updatedAt = params.updatedAt
  }

  return prisma.task.findMany({ where, orderBy: { id: "desc" } })
}

export async function updateTaskStatus(taskId: number, status: string) {
  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  })
}

export async function updateTaskNote(taskId: number, note: string) {
  return prisma.task.update({
    where: { id: taskId },
    data: { note },
  })
}

export async function updateTaskDueDate(taskId: number, dueDate: Date) {
  return prisma.task.update({
    where: { id: taskId },
    data: { dueDate },
  })
}

export async function removeAssignedFromTask(taskId: number, userId: number) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      assignedTo: {
        disconnect: { id: userId },
      },
    },
  })
}

export async function addAssignedToTask(taskId: number, userId: number) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      assignedTo: {
        connect: { id: userId },
      },
    },
  })
}

export async function deleteTask(taskId: number) {
  return prisma.task.delete({
    where: { id: taskId },
  })
}

export async function createTask(input: TaskCreationParams) {
  const data: any = {
    title: input.title,
    details: input.details,
    status: input.status,
    note: input.note,
    dueDate: input.dueDate,
  }

  return prisma.task.create({
    data: {
        ...data,
        project: {
            connect: { id: 1 },
        },
        assignedTo: {
            connect: input.assignedTo.map((userId) => ({ id: userId })),
        },
    },
  })
}