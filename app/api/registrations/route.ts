import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const competitionId = searchParams.get("competitionId")
    const status = searchParams.get("status")

    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Base query
    let query = sql`
      SELECT r.*, c.title as competition_title, c.type as competition_type, c.region as competition_region,
      c."eventStart" as competition_start, c."eventEnd" as competition_end,
      t.name as team_name
      FROM "Registration" r
      LEFT JOIN "Competition" c ON r."competitionId" = c.id
      LEFT JOIN "Team" t ON r."teamId" = t.id
      WHERE 1=1
    `

    // Add filters if provided
    if (userId) {
      query = sql`${query} AND r."userId" = ${userId}`
    }

    if (competitionId) {
      query = sql`${query} AND r."competitionId" = ${competitionId}`
    }

    if (status) {
      query = sql`${query} AND r.status = ${status}`
    }

    // Add order by
    query = sql`${query} ORDER BY r."createdAt" DESC`

    const result = await query

    // Format the response
    const formattedRegistrations = result.map((reg: any) => ({
      id: reg.id,
      competitionId: reg.competitionId,
      competitionTitle: reg.competition_title,
      competitionType: reg.competition_type,
      competitionRegion: reg.competition_region,
      competitionStart: reg.competition_start,
      competitionEnd: reg.competition_end,
      userId: reg.userId,
      teamId: reg.teamId,
      teamName: reg.team_name,
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      paymentId: reg.paymentId,
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
    }))

    return NextResponse.json(formattedRegistrations)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { competitionId, userId, teamId } = data

    // Check if user already registered for this competition
    const checkResult = await sql`
      SELECT * FROM "Registration"
      WHERE "competitionId" = ${competitionId} AND "userId" = ${userId}
    `

    if (checkResult.length > 0) {
      return NextResponse.json({ error: "Вы уже зарегистрированы на это соревнование" }, { status: 400 })
    }

    // Create a new registration
    const id = `reg_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "Registration" (
        id, "competitionId", "userId", "teamId", status, "paymentStatus", "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${competitionId}, ${userId}, ${teamId || null}, ${data.status || "PENDING"}, 
        ${data.paymentStatus || "PENDING"}, ${now}, ${now}
      )
      RETURNING *
    `

    // Update competition participants count
    await sql`
      UPDATE "Competition"
      SET "currentParticipants" = "currentParticipants" + 1
      WHERE id = ${competitionId}
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating registration:", error)
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 })
  }
}
