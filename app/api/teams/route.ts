import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const competitionId = searchParams.get("competitionId")

    let query = sql`
      SELECT t.*, c.title as competition_title, u.name as captain_name,
      (SELECT COUNT(*) FROM "TeamMember" tm WHERE tm."teamId" = t.id) as member_count
      FROM "Team" t
      LEFT JOIN "Competition" c ON t."competitionId" = c.id
      LEFT JOIN "User" u ON t."captainId" = u.id
      WHERE 1=1
    `

    // Add filters if provided
    if (userId) {
      query = sql`
        ${query} AND t.id IN (SELECT "teamId" FROM "TeamMember" WHERE "userId" = ${userId})
      `
    }

    if (competitionId) {
      query = sql`
        ${query} AND t."competitionId" = ${competitionId}
      `
    }

    // Add order by
    query = sql`
      ${query} ORDER BY t."createdAt" DESC
    `

    const result = await query

    // Format the response
    const formattedTeams = result.map((team: any) => ({
      id: team.id,
      name: team.name,
      competitionId: team.competitionId,
      competitionTitle: team.competition_title,
      captainId: team.captainId,
      captainName: team.captain_name,
      status: team.status,
      memberCount: Number.parseInt(team.member_count) || 0,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }))

    return NextResponse.json(formattedTeams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, competitionId, captainId } = data

    // Create a new team
    const id = `team_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "Team" (
        id, name, "competitionId", "captainId", status, "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${name}, ${competitionId}, ${captainId}, ${data.status || "NEEDS_MEMBERS"}, ${now}, ${now}
      )
      RETURNING *
    `

    // Add captain as team member
    await sql`
      INSERT INTO "TeamMember" (
        id, "teamId", "userId", "isCaptain", "joinedAt"
      )
      VALUES (
        ${"tm_" + Date.now()}, ${id}, ${captainId}, ${true}, ${now}
      )
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
