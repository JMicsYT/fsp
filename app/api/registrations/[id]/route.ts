import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const query = `
      SELECT r.*, c.title as competition_title, u.name as user_name, u.email as user_email
      FROM "Registration" r
      LEFT JOIN "Competition" c ON r."competitionId" = c.id
      LEFT JOIN "User" u ON r."userId" = u.id
      WHERE r.id = $1
    `

    const result = await sql(query, [id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    const reg = result[0]

    // Format the response
    const formattedRegistration = {
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
    }

    return NextResponse.json(formattedRegistration)
  } catch (error) {
    console.error("Error fetching registration:", error)
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Update registration
    const query = `
      UPDATE "Registration"
      SET 
        status = $1,
        "paymentStatus" = $2,
        "updatedAt" = $3
      WHERE id = $4
      RETURNING *
    `

    const result = await sql(query, [data.status, data.paymentStatus, new Date(), id])

    if (result.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get the registration to find the competition ID
    const getQuery = `
      SELECT "competitionId" FROM "Registration"
      WHERE id = $1
    `

    const getResult = await sql(getQuery, [id])

    if (getResult.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    const competitionId = getResult[0].competitionId

    // Delete registration
    const deleteQuery = `
      DELETE FROM "Registration"
      WHERE id = $1
      RETURNING *
    `

    const result = await sql(deleteQuery, [id])

    // Update competition participant count
    await sql(
      `
      UPDATE "Competition"
      SET "currentParticipants" = GREATEST("currentParticipants" - 1, 0)
      WHERE id = $1
    `,
      [competitionId],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 })
  }
}
