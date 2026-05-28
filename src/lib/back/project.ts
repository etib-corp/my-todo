import { prisma } from "@/lib/prisma"

export interface ProjectListingParams {
  id?: number
  name?: string
  status?: string
  members?: number[]
  updatedAt?: Date
}

export interface ProjectCreationParams {
  name: string
  status: string
  members: number[]
  note: string
  tasks: number[]
}

export async function listProjects(params: ProjectListingParams) {
  const where: any = {}

  if (params.id !== undefined) {
    where.id = params.id
  }

  if (params.name !== undefined) {
    where.name = params.name
  }

  if (params.status !== undefined) {
    where.status = params.status
  }

  if (params.members !== undefined) {
    where.members = {
      some: {
        id: { in: params.members.map((member) => member) },
      },
    }
  }

  if (params.updatedAt !== undefined) {
    where.updatedAt = params.updatedAt
  }

  return prisma.project.findMany({ where, orderBy: { id: "desc" } })
}

export async function removeMemberFromProject(projectId: number, userId: number) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        disconnect: { id: userId },
      },
    },
  })
}

export async function addMemberToProject(projectId: number, userId: number) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        connect: { id: userId },
      },
    },
  })
}

export async function removeTaskFromProject(projectId: number, taskId: number) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      tasks: {
        disconnect: { id: taskId },
      },
    },
  })
}

export async function addTaskToProject(projectId: number, taskId: number) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      tasks: {
        connect: { id: taskId },
      },
    },
  })
}

export async function updateProjectStatus(projectId: number, status: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      status,
    },
  })
}

export async function updateProjectNote(projectId: number, note: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: {
      note,
    },
  })
}

export async function deleteProject(projectId: number) {
  return prisma.project.delete({
    where: { id: projectId },
  })
}

export async function createProject(input: ProjectCreationParams) {
  return prisma.project.create({
    data: {
      ...input,
      members: {
        connect: input.members.map((member) => ({ id: member })),
      },
      tasks: {
        connect: input.tasks.map((task) => ({ id: task })),
      },
    },
  })
}