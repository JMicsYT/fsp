import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import sql from "@/lib/db"

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id: userId } = await context.params // 👈 await здесь НЕ НУЖЕН, context.params уже синхронный

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log("🔑 TOKEN:", token)
  console.log("📦 PARAM ID:", userId)

  if (!token || (token.id !== userId && token.role !== "ADMIN")) {
    console.warn("⛔️ Unauthorized access attempt", {
      tokenId: token?.id,
      tokenRole: token?.role,
      requestedId: userId,
    })

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await sql`
      SELECT id, name, email, role, region, organization, phone, image, "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("💥 Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context

  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    console.log("🔐 TOKEN:", token)

    if (!token || (token.id !== params.id && token.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
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
