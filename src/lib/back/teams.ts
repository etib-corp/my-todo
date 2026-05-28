import { prisma } from "@/lib/prisma"

export interface TeamListingParams {
  id?: number
  name?: string
}

export interface TeamCreationParams {
  name: string
  description: string
}

export async function listTeams(params: TeamListingParams) {
  const where: any = {}

  if (params.id !== undefined) {
    where.id = params.id
  }

  if (params.name !== undefined) {
    where.name = params.name
  }

  return prisma.team.findMany({ where, orderBy: { id: "asc" } })
}

export async function removeUserFromTeam(teamId: number, userId: number) {
  return prisma.team.update({
    where: { id: teamId },
    data: {
      users: {
        disconnect: { id: userId },
      },
    },
  })
}

export async function addUserToTeam(teamId: number, userId: number) {
  return prisma.team.update({
    where: { id: teamId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  })
}

export async function deleteTeam(teamId: number) {
  return prisma.team.delete({
    where: { id: teamId },
  })
}

export async function createTeam(input: TeamCreationParams) {
  return prisma.team.create({
    data: {
      name: input.name,
      description: input.description,
    },
  })
}