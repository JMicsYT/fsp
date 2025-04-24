// app/api/competitions/route.ts
import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search") || ""
    const types = searchParams.getAll("type")
    const discipline = searchParams.get("discipline") || ""
    const region = searchParams.get("region") || ""
    const statuses = searchParams.getAll("status")
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    // Собираем WHERE-условия динамически
    const comps = await sql<{
      id: string
      title: string
      type: string
      discipline: string
      region: string
      registrationStart: Date
      registrationEnd: Date
      eventStart: Date
      eventEnd: Date
      currentParticipants: number
      maxParticipants: number | null
      status: string
    }[]>`
      SELECT
        "id", "title", "type", "discipline", "region",
        "registrationStart", "registrationEnd",
        "eventStart", "eventEnd",
        "currentParticipants", "maxParticipants",
        "status"
      FROM "Competition"
      WHERE
        ("title" ILIKE ${`%${search}%`})
        ${types.length
          ? sql`AND "type" IN (${sql.join(types, sql`,`)})`
          : sql``}
        ${discipline
          ? sql`AND "discipline" = ${discipline}`
          : sql``}
        ${region
          ? sql`AND "region" = ${region}`
          : sql``}
        ${statuses.length
          ? sql`AND "status" IN (${sql.join(statuses, sql`,`)})`
          : sql``}
        ${fromDate
          ? sql`AND "eventStart" >= ${new Date(fromDate)}`
          : sql``}
        ${toDate
          ? sql`AND "eventEnd" <= ${new Date(toDate)}`
          : sql``}
      ORDER BY "eventStart" DESC
    `
    return NextResponse.json(comps)
  } catch (error) {
    console.error("❌ [GET /api/competitions] error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // … ваш код вставки из POST с result = await sql`INSERT …`
    // и в конце:
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("❌ [POST /api/competitions] error:", error)
    return NextResponse.json({ error: "Failed to create competition" }, { status: 500 })
  }
}
