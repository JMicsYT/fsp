import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizerId = searchParams.get("organizerId")

    if (!organizerId) {
      return NextResponse.json({ error: "Organizer ID is required" }, { status: 400 })
    }

    const query = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM "Registration" r WHERE r."competitionId" = c.id) as registration_count
      FROM "Competition" c
      WHERE c."organizerId" = $1
      ORDER BY c."eventStart" DESC
    `

    const result = await sql(query, [organizerId])

    // Format the response
    const formattedCompetitions = result.map((comp: any) => ({
      id: comp.id,
      title: comp.title,
      type: comp.type,
      discipline: comp.discipline,
      registrationStart: comp.registrationStart,
      registrationEnd: comp.registrationEnd,
      eventStart: comp.eventStart,
      eventEnd: comp.eventEnd,
      maxParticipants: comp.maxParticipants,
      currentParticipants: comp.currentParticipants || 0,
      status: comp.status,
      registrationCount: Number.parseInt(comp.registration_count) || 0,
    }))

    return NextResponse.json(formattedCompetitions)
  } catch (error) {
    console.error("Error fetching organizer competitions:", error)
    return NextResponse.json({ error: "Failed to fetch organizer competitions" }, { status: 500 })
  }
}
