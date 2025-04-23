import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if admin user exists, if not create one
    const adminUsers = await sql`
      SELECT * FROM "User" WHERE role = 'ADMIN' LIMIT 1
    `

    let adminId = ""

    if (adminUsers.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10)
      const adminUser = await sql`
        INSERT INTO "User" (
          id, name, email, password, role, "createdAt", "updatedAt"
        ) VALUES (
          ${uuidv4()}, 'Admin User', 'admin@example.com', ${hashedPassword}, 'ADMIN', NOW(), NOW()
        )
        RETURNING id
      `
      adminId = adminUser[0].id
    } else {
      adminId = adminUsers[0].id
    }

    // Sample competitions data
    const competitions = [
      {
        id: uuidv4(),
        title: "Чемпионат России по футболу",
        type: "FEDERAL",
        discipline: "Футбол",
        description: "Ежегодный чемпионат России по футболу среди профессиональных команд",
        rules: "Стандартные правила FIFA",
        prizes: "1 место - 1,000,000 руб, 2 место - 500,000 руб, 3 место - 250,000 руб",
        region: "Москва",
        registrationStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        registrationEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        eventStart: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
        eventEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        maxParticipants: 32,
        currentParticipants: 12,
        status: "REGISTRATION_OPEN",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Кубок Санкт-Петербурга по баскетболу",
        type: "REGIONAL",
        discipline: "Баскетбол",
        description: "Региональный турнир по баскетболу среди любительских команд",
        rules: "Правила FIBA с модификациями для любительских команд",
        prizes: "Кубки и медали для победителей",
        region: "Санкт-Петербург",
        registrationStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        registrationEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        eventStart: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        eventEnd: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
        maxParticipants: 16,
        currentParticipants: 8,
        status: "REGISTRATION_OPEN",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Открытый турнир по волейболу",
        type: "OPEN",
        discipline: "Волейбол",
        description: "Открытый турнир по волейболу для всех желающих",
        rules: "Стандартные правила волейбола",
        prizes: "Призы от спонсоров",
        region: "Казань",
        registrationStart: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        registrationEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        eventStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        eventEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        maxParticipants: 12,
        currentParticipants: 12,
        status: "REGISTRATION_CLOSED",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Чемпионат по плаванию",
        type: "FEDERAL",
        discipline: "Плавание",
        description: "Всероссийский чемпионат по плаванию",
        rules: "Правила FINA",
        prizes: "Медали и денежные призы",
        region: "Москва",
        registrationStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        registrationEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        eventStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        eventEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        maxParticipants: 100,
        currentParticipants: 87,
        status: "COMPLETED",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Турнир по теннису",
        type: "REGIONAL",
        discipline: "Теннис",
        description: "Региональный турнир по теннису",
        rules: "Правила ITF",
        prizes: "Кубки и ценные призы",
        region: "Сочи",
        registrationStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        registrationEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        eventStart: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        eventEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
        maxParticipants: 32,
        currentParticipants: 18,
        status: "REGISTRATION_OPEN",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Марафон 'Золотая осень'",
        type: "OPEN",
        discipline: "Лёгкая атлетика",
        description: "Ежегодный марафон для профессионалов и любителей",
        rules: "Стандартные правила марафона",
        prizes: "Медали всем финишерам, призы победителям",
        region: "Москва",
        registrationStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        registrationEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        eventStart: new Date(Date.now()).toISOString(), // today
        eventEnd: new Date(Date.now()).toISOString(), // today
        maxParticipants: 1000,
        currentParticipants: 876,
        status: "IN_PROGRESS",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Турнир по шахматам",
        type: "REGIONAL",
        discipline: "Шахматы",
        description: "Региональный турнир по шахматам",
        rules: "Правила FIDE",
        prizes: "Денежные призы и кубки",
        region: "Екатеринбург",
        registrationStart: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        registrationEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        eventStart: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
        eventEnd: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days from now
        maxParticipants: 64,
        currentParticipants: 32,
        status: "REGISTRATION_OPEN",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Чемпионат по боксу",
        type: "FEDERAL",
        discipline: "Бокс",
        description: "Всероссийский чемпионат по боксу",
        rules: "Правила AIBA",
        prizes: "Медали, кубки и денежные призы",
        region: "Новосибирск",
        registrationStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        registrationEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        eventStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        eventEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        maxParticipants: 128,
        currentParticipants: 112,
        status: "IN_PROGRESS",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Турнир по бадминтону",
        type: "OPEN",
        discipline: "Бадминтон",
        description: "Открытый турнир по бадминтону",
        rules: "Правила BWF",
        prizes: "Медали и спортивный инвентарь",
        region: "Казань",
        registrationStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        registrationEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
        eventStart: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        eventEnd: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(), // 32 days from now
        maxParticipants: 32,
        currentParticipants: 14,
        status: "REGISTRATION_OPEN",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Чемпионат по настольному теннису",
        type: "REGIONAL",
        discipline: "Настольный теннис",
        description: "Региональный чемпионат по настольному теннису",
        rules: "Правила ITTF",
        prizes: "Кубки и медали",
        region: "Санкт-Петербург",
        registrationStart: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
        registrationEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        eventStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        eventEnd: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
        maxParticipants: 48,
        currentParticipants: 48,
        status: "REGISTRATION_CLOSED",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Кубок по лыжным гонкам",
        type: "FEDERAL",
        discipline: "Лыжные гонки",
        description: "Всероссийский кубок по лыжным гонкам",
        rules: "Правила FIS",
        prizes: "Кубки, медали и денежные призы",
        region: "Мурманская область",
        registrationStart: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        registrationEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        eventStart: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        eventEnd: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        maxParticipants: 200,
        currentParticipants: 187,
        status: "COMPLETED",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Чемпионат по гимнастике",
        type: "FEDERAL",
        discipline: "Гимнастика",
        description: "Всероссийский чемпионат по гимнастике",
        rules: "Правила FIG",
        prizes: "Медали и денежные призы",
        region: "Москва",
        registrationStart: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
        registrationEnd: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        eventStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        eventEnd: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        maxParticipants: 80,
        currentParticipants: 72,
        status: "COMPLETED",
        organizerId: adminId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    // Insert competitions
    for (const competition of competitions) {
      await sql`
        INSERT INTO "Competition" (
          id, title, type, discipline, description, rules, prizes, region,
          "registrationStart", "registrationEnd", "eventStart", "eventEnd",
          "maxParticipants", "currentParticipants", status, "organizerId",
          "createdAt", "updatedAt"
        ) VALUES (
          ${competition.id}, ${competition.title}, ${competition.type}, ${competition.discipline},
          ${competition.description}, ${competition.rules}, ${competition.prizes}, ${competition.region},
          ${competition.registrationStart}, ${competition.registrationEnd}, ${competition.eventStart}, ${competition.eventEnd},
          ${competition.maxParticipants}, ${competition.currentParticipants}, ${competition.status}, ${competition.organizerId},
          ${competition.createdAt}, ${competition.updatedAt}
        )
        ON CONFLICT (id) DO NOTHING
      `
    }

    return NextResponse.json({ success: true, message: "Competitions seeded successfully" })
  } catch (error) {
    console.error("Error seeding competitions:", error)
    return NextResponse.json({ success: false, error: "Failed to seed competitions" }, { status: 500 })
  }
}
