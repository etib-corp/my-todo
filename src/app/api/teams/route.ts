import { NextResponse } from "next/server";

import {
    listTeams,
    createTeam,
    deleteTeam,
    addUserToTeam,
    removeUserFromTeam,
    TeamListingParams,
    TeamCreationParams
} from "@/lib/back/teams";

export async function GET(params: URLSearchParams) {
  const idParam = params.get("id");
  const nameParam = params.get("name");

  const searchParams: TeamListingParams = {
    id: idParam ? parseInt(idParam) : undefined,
    name: nameParam ?? undefined,
  };

  const teams = await listTeams(searchParams);

  return NextResponse.json({ teams });
}

export async function POST(request: Request) {
    const payload = (await request.json().catch(() => null)) as {
    name?: string
    description?: string
  } | null;

    if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const data: TeamCreationParams = {
    name: payload.name ?? "",
    description: payload.description ?? "",
  }

    if (!data.name) {
        return NextResponse.json(
            { error: "Team name is required" },
            { status: 400 },
        );
    }

    const team = await createTeam(data);

    return NextResponse.json({ team });
}

export async function PATCH(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    teamId?: number
    removeUserId?: number
    addUserId?: number
  } | null;

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { teamId, removeUserId, addUserId } = payload;

  if (!teamId) {
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 },
    );
  }

  if (removeUserId) {
    await removeUserFromTeam(teamId, removeUserId);
  }

  if (addUserId) {
    await addUserToTeam(teamId, addUserId);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const payload = (await request.json().catch(() => null)) as {
    teamId?: number
  } | null;

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { teamId } = payload;

  if (!teamId) {
    return NextResponse.json(
      { error: "Team ID is required" },
      { status: 400 },
    );
  }

  await deleteTeam(teamId);

  return NextResponse.json({ success: true });
}
