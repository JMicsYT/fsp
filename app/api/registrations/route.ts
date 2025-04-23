import { NextResponse } from "next/server"
import sql from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role, region, organization, phone } = body

    const existingUsers = await sql`SELECT * FROM "User" WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = `user_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "User" (
        id, name, email, password, role, region, organization, phone, "createdAt", "updatedAt"
      ) VALUES (
        ${userId}, ${name}, ${email}, ${hashedPassword}, ${role || "ATHLETE"},
        ${region || null}, ${organization || null}, ${phone || null}, ${now}, ${now}
      )
      RETURNING *
    `

    // Надёжная сериализация через stringify/parse
    const safeUser = JSON.parse(JSON.stringify(result[0]))

    return NextResponse.json(
      {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        role: result[0].role,
        region: result[0].region,
        organization: result[0].organization,
        phone: result[0].phone,
        createdAt: result[0].createdAt.toISOString(),
        updatedAt: result[0].updatedAt.toISOString(),
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Error during registration:", error)
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 })
  }
}
