import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const organizerId = searchParams.get("organizerId")

    if (!organizerId) {
      return NextResponse.json({ error: "Organizer ID is required" }, { status: 400 })
    }

    // Get total competitions
    const competitionsQuery = `
      SELECT COUNT(*) as total_competitions
      FROM "Competition"
      WHERE "organizerId" = $1
    `

    const competitionsResult = await sql(competitionsQuery, [organizerId])
    const totalCompetitions = Number.parseInt(competitionsResult[0].total_competitions) || 0

    // Get active competitions
    const activeQuery = `
      SELECT COUNT(*) as active_competitions
      FROM "Competition"
      WHERE "organizerId" = $1 AND status IN ('REGISTRATION_OPEN', 'IN_PROGRESS')
    `

    const activeResult = await sql(activeQuery, [organizerId])
    const activeCompetitions = Number.parseInt(activeResult[0].active_competitions) || 0

    // Get total registrations
    const registrationsQuery = `
      SELECT COUNT(*) as total_registrations
      FROM "Registration" r
      JOIN "Competition" c ON r."competitionId" = c.id
      WHERE c."organizerId" = $1
    `

    const registrationsResult = await sql(registrationsQuery, [organizerId])
    const totalRegistrations = Number.parseInt(registrationsResult[0].total_registrations) || 0

    // Get pending registrations
    const pendingQuery = `
      SELECT COUNT(*) as pending_registrations
      FROM "Registration" r
      JOIN "Competition" c ON r."competitionId" = c.id
      WHERE c."organizerId" = $1 AND r.status = 'PENDING'
    `

    const pendingResult = await sql(pendingQuery, [organizerId])
    const pendingRegistrations = Number.parseInt(pendingResult[0].pending_registrations) || 0

    // Get recent registrations
    const recentQuery = `
      SELECT r.id, r.status, r."createdAt", c.title as competition_title, u.name as user_name
      FROM "Registration" r
      JOIN "Competition" c ON r."competitionId" = c.id
      JOIN "User" u ON r."userId" = u.id
      WHERE c."organizerId" = $1
      ORDER BY r."createdAt" DESC
      LIMIT 5
    `

    const recentResult = await sql(recentQuery, [organizerId])

    const recentRegistrations = recentResult.map((reg: any) => ({
      id: reg.id,
      status: reg.status,
      createdAt: reg.createdAt,
      competitionTitle: reg.competition_title,
      userName: reg.user_name,
    }))

    // Get upcoming competitions
    const upcomingQuery = `
      SELECT id, title, "eventStart", "currentParticipants", "maxParticipants"
      FROM "Competition"
      WHERE "organizerId" = $1 AND "eventStart" > NOW()
      ORDER BY "eventStart" ASC
      LIMIT 3
    `

    const upcomingResult = await sql(upcomingQuery, [organizerId])

    const upcomingCompetitions = upcomingResult.map((comp: any) => ({
      id: comp.id,
      title: comp.title,
      eventStart: comp.eventStart,
      currentParticipants: comp.currentParticipants || 0,
      maxParticipants: comp.maxParticipants,
    }))

    return NextResponse.json({
      totalCompetitions,
      activeCompetitions,
      totalRegistrations,
      pendingRegistrations,
      recentRegistrations,
      upcomingCompetitions,
    })
  } catch (error) {
    console.error("Error fetching organizer stats:", error)
    return NextResponse.json({ error: "Failed to fetch organizer stats" }, { status: 500 })
  }
}
