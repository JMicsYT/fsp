import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string
const sql = neon(
  "postgresql://neondb_owner:npg_pLImMPQx90kw@ep-shy-snow-a2vkpjfh-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require",
)

export default sql
