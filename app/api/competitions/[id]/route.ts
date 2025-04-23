import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get competition details
    const query = `
      SELECT c.*, u.name as organizer_name, u.email as organizer_email
      FROM "Competition" c
      LEFT JOIN "User" u ON c."organizerId" = u.id
      WHERE c.id = $1
    `

    const result = await sql(query, [id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 })
    }

    const competition = result[0]

    // Get teams for this competition
    const teamsQuery = `
      SELECT t.*, u.name as captain_name
      FROM "Team" t
      LEFT JOIN "User" u ON t."captainId" = u.id
      WHERE t."competitionId" = $1
    `

    const teamsResult = await sql(teamsQuery, [id])

    // Format the response
    const formattedCompetition = {
      id: competition.id,
      title: competition.title,
      type: competition.type,
      discipline: competition.discipline,
      description: competition.description,
      rules: competition.rules,
      prizes: competition.prizes,
      region: competition.region,
      registrationStart: competition.registrationStart,
      registrationEnd: competition.registrationEnd,
      eventStart: competition.eventStart,
      eventEnd: competition.eventEnd,
      maxParticipants: competition.maxParticipants,
      currentParticipants: competition.currentParticipants || 0,
      status: competition.status,
      createdAt: competition.createdAt,
      updatedAt: competition.updatedAt,
      organizer: {
        id: competition.organizerId,
        name: competition.organizer_name,
        email: competition.organizer_email,
      },
      teams: teamsResult.map((team: any) => ({
        id: team.id,
        name: team.name,
        status: team.status,
        captain: {
          id: team.captainId,
          name: team.captain_name,
        },
      })),
    }

    return NextResponse.json(formattedCompetition)
  } catch (error) {
    console.error("Error fetching competition:", error)
    return NextResponse.json({ error: "Failed to fetch competition" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Update competition
    const query = `
      UPDATE "Competition"
      SET 
        title = $1,
        type = $2,
        discipline = $3,
        description = $4,
        rules = $5,
        prizes = $6,
        region = $7,
        "registrationStart" = $8,
        "registrationEnd" = $9,
        "eventStart" = $10,
        "eventEnd" = $11,
        "maxParticipants" = $12,
        status = $13,
        "updatedAt" = $14
      WHERE id = $15
      RETURNING *
    `

    const result = await sql(query, [
      data.title,
      data.type,
      data.discipline,
      data.description,
      data.rules,
      data.prizes,
      data.region,
      new Date(data.registrationStart),
      new Date(data.registrationEnd),
      new Date(data.eventStart),
      new Date(data.eventEnd),
      data.maxParticipants,
      data.status,
      new Date(),
      id,
    ])

    if (result.length === 0) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating competition:", error)
    return NextResponse.json({ error: "Failed to update competition" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete competition
    const query = `
      DELETE FROM "Competition"
      WHERE id = $1
      RETURNING *
    `

    const result = await sql(query, [id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting competition:", error)
    return NextResponse.json({ error: "Failed to delete competition" }, { status: 500 })
  }
}
