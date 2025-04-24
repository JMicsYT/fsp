// app/api/competitions/[id]/teams/route.ts
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getToken } from "next-auth/jwt"
import sql from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1) Проверяем JWT-токен в куках
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2) Убедимся, что роль — ATHLETE
  if (token.role !== "ATHLETE") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // 3) Читаем название команды из тела запроса
  const { name } = await req.json()
  const teamName = String(name || "").trim()
  if (!teamName) {
    return NextResponse.json(
      { error: "Team name is required" },
      { status: 400 }
    )
  }

  const competitionId = params.id
  const captainId = token.sub as string

  try {
    // 4) Вставляем новую команду в БД
    const [team] = await sql<{
      id: string
      name: string
      competitionId: string
      captainId: string
      status: string
    }[]>`
      INSERT INTO "Team" (id, name, "competitionId", "captainId", status)
      VALUES (${uuid()}, ${teamName}, ${competitionId}, ${captainId}, 'PENDING')
      RETURNING id, name, "competitionId", "captainId", status
    `
    return NextResponse.json(team, { status: 201 })
  } catch (err) {
    console.error("❌ [POST /api/competitions/[id]/teams]", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
