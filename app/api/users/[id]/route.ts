import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to this user data
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT id, name, email, role, region, organization, phone, image, "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user stats
    const statsResult = await sql`
      SELECT 
        (SELECT COUNT(*) FROM "Registration" WHERE "userId" = ${params.id}) as registrations_count,
        (SELECT COUNT(*) FROM "TeamMember" WHERE "userId" = ${params.id}) as teams_count,
        (SELECT COUNT(*) FROM "Achievement" WHERE "userId" = ${params.id}) as achievements_count
    `

    const stats = statsResult[0] || { registrations_count: 0, teams_count: 0, achievements_count: 0 }

    // Combine user data with stats
    const userData = {
      ...result[0],
      registrationsCount: Number.parseInt(stats.registrations_count),
      teamsCount: Number.parseInt(stats.teams_count),
      achievementsCount: Number.parseInt(stats.achievements_count),
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has access to update this user
    if (!session || (session.user.id !== params.id && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name, region, organization, phone, image } = data
    const now = new Date()

    const result = await sql`
      UPDATE "User"
      SET name = ${name}, 
          region = ${region || null}, 
          organization = ${organization || null}, 
          phone = ${phone || null}, 
          image = ${image || null}, 
          "updatedAt" = ${now}
      WHERE id = ${params.id}
      RETURNING id, name, email, role, region, organization, phone, image, "createdAt", "updatedAt"
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
