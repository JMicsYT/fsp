import { NextResponse } from "next/server"
import sql from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { name, email, password, role, region, organization, phone } = data

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM "User"
      WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const id = `usr_${Date.now()}`
    const now = new Date()

    const result = await sql`
      INSERT INTO "User" (
        id, name, email, password, role, region, organization, phone, "createdAt", "updatedAt"
      )
      VALUES (
        ${id}, ${name}, ${email}, ${hashedPassword}, ${role || "ATHLETE"}, 
        ${region || null}, ${organization || null}, ${phone || null}, ${now}, ${now}
      )
      RETURNING id, name, email, role, region, organization, phone, "createdAt", "updatedAt"
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
