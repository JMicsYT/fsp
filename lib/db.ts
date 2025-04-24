// lib/db.ts
console.log("🔌 Connecting to Postgres via:", process.env.DATABASE_URL)

import postgres from "postgres"
const sql = postgres(process.env.DATABASE_URL!, { ssl: false })
export default sql
