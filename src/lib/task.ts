import { prisma } from "@/lib/prisma"

import { User } from "@/interface/User"
import { Project } from "@/interface/Project"

interface TasksListingParams {
  id?: number
  project?: Project
  assignedTo?: User[]
  status?: string
  note?: string
  dueDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

interface TaskCreationParams {
  title: string
  details: string
  project: Project
  assignedTo: User[]
  status: string
  note: string
  dueDate: Date
}

export async function listTasks(params: TasksListingParams) {
  const where: any = {}

  if (params.id !== undefined) {
    where.id = params.id
  }

  if (params.project !== undefined) {
    where.projectId = params.project.id
  }

  if (params.assignedTo !== undefined) {
    where.assignedTo = {
      some: {
        id: { in: params.assignedTo.map((user) => user.id) },
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
  return prisma.task.create({
    data: {
        ...input,
        project: {
            connect: { id: input.project.id },
        },
        assignedTo: {
            connect: input.assignedTo.map((user) => ({ id: user.id })),
        },
    },
  })
}