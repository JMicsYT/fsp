// app/api/organizer/competitions/route.ts
import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // теперь читаем именно «organizerId»
  const organizerId = searchParams.get("organizerId")
  console.log("▶️ [GET /api/organizer/competitions] organizerId:", organizerId)

  if (!organizerId) {
    return NextResponse.json(
      { error: "Missing organizerId" },
      { status: 400 }
    )
  }

  try {
    const comps = await sql<{
      id: string
      title: string
      type: string
      discipline: string
      region: string
      "eventStart": Date
      "eventEnd": Date
      status: string
      "createdAt": Date
    }[]>`
      SELECT
        "id", "title", "type", "discipline", "region",
        "eventStart", "eventEnd",
        "status", "createdAt"
      FROM "Competition"
      WHERE "organizerId" = ${organizerId}
      ORDER BY "createdAt" DESC
    `
    console.log("✅ [GET /api/organizer/competitions] found:", comps)
    return NextResponse.json(comps)
  } catch (err) {
    console.error("❌ [GET /api/organizer/competitions] error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
