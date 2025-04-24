// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import sql from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role, region, organization, phone } = body

    const userExists = await sql`
      SELECT 1 FROM "User" WHERE email = ${email}
    `
    if (userExists.length > 0) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await sql`
      INSERT INTO "User" (id, name, email, password, role, region, organization, phone, "createdAt", "updatedAt")
      VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${hashedPassword}, ${role}, ${region}, ${organization}, ${phone}, NOW(), NOW())
      RETURNING id, name, email, role, region, organization, phone
    `
    
    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
