import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizerId = searchParams.get("organizerId")
    const competitionId = searchParams.get("competitionId")
    const status = searchParams.get("status")

    if (!organizerId) {
      return NextResponse.json({ error: "Organizer ID is required" }, { status: 400 })
    }

    let query = `
      SELECT r.*, c.title as competition_title, u.name as user_name, u.email as user_email
      FROM "Registration" r
      JOIN "Competition" c ON r."competitionId" = c.id
      JOIN "User" u ON r."userId" = u.id
      WHERE c."organizerId" = $1
    `

    const params: any[] = [organizerId]
    let paramIndex = 2

    if (competitionId) {
      query += ` AND r."competitionId" = $${paramIndex}`
      params.push(competitionId)
      paramIndex++
    }

    if (status) {
      query += ` AND r.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY r."createdAt" DESC`

    const result = await sql(query, params)

    // Format the response
    const formattedRegistrations = result.map((reg: any) => ({
      id: reg.id,
      competitionId: reg.competitionId,
      competitionTitle: reg.competition_title,
      userId: reg.userId,
      userName: reg.user_name,
      userEmail: reg.user_email,
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      createdAt: reg.createdAt,
      updatedAt: reg.updatedAt,
    }))

    return NextResponse.json(formattedRegistrations)
  } catch (error) {
    console.error("Error fetching organizer registrations:", error)
    return NextResponse.json({ error: "Failed to fetch organizer registrations" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { registrationId, status, paymentStatus } = data

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 })
    }

    const query = `
      UPDATE "Registration"
      SET 
        status = $1,
        "paymentStatus" = $2,
        "updatedAt" = $3
      WHERE id = $4
      RETURNING *
    `

    const result = await sql(query, [status, paymentStatus, new Date(), registrationId])

    if (result.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 })
  }
}
