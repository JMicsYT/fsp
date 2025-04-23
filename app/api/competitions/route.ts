import { type NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const types = searchParams.getAll("type")
    const discipline = searchParams.get("discipline") || ""
    const region = searchParams.get("region") || ""
    const statuses = searchParams.getAll("status")
    const fromDate = searchParams.get("fromDate") || ""
    const toDate = searchParams.get("toDate") || ""

    // Build the query
    let query = `
      SELECT * FROM "Competition"
      WHERE 1=1
    `
    const params: any[] = []

    // Add search filter
    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    // Add types filter
    if (types.length > 0) {
      query += ` AND type IN (${types.map((_, i) => `$${params.length + i + 1}`).join(", ")})`
      params.push(...types)
    }

    // Add discipline filter
    if (discipline) {
      query += ` AND discipline ILIKE $${params.length + 1}`
      params.push(`%${discipline}%`)
    }

    // Add region filter
    if (region) {
      query += ` AND region ILIKE $${params.length + 1}`
      params.push(`%${region}%`)
    }

    // Add statuses filter
    if (statuses.length > 0) {
      query += ` AND status IN (${statuses.map((_, i) => `$${params.length + i + 1}`).join(", ")})`
      params.push(...statuses)
    }

    // Add date filters
    if (fromDate) {
      query += ` AND "eventStart" >= $${params.length + 1}`
      params.push(fromDate)
    }

    if (toDate) {
      query += ` AND "eventEnd" <= $${params.length + 1}`
      params.push(toDate)
    }

    // Add order by
    query += ` ORDER BY "eventStart" ASC`

    // Execute the query
    const competitions = await sql.unsafe(query, params)

    return NextResponse.json(competitions)
  } catch (error) {
    console.error("Error fetching competitions:", error)
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      title,
      type,
      discipline,
      description,
      rules,
      prizes,
      region,
      registrationStart,
      registrationEnd,
      eventStart,
      eventEnd,
      maxParticipants,
      organizerId,
    } = data

    // Create a new competition
    const id = `comp_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "Competition" (
        id, title, type, discipline, description, rules, prizes, region,
        "registrationStart", "registrationEnd", "eventStart", "eventEnd",
        "maxParticipants", "currentParticipants", status, "organizerId", "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${title}, ${type}, ${discipline}, ${description}, ${rules}, ${prizes}, ${region},
        ${registrationStart}, ${registrationEnd}, ${eventStart}, ${eventEnd},
        ${maxParticipants}, ${0}, ${data.status || "REGISTRATION_OPEN"}, ${organizerId}, ${now}, ${now}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating competition:", error)
    return NextResponse.json({ error: "Failed to create competition" }, { status: 500 })
  }
}
