import type { Metadata } from "next"
import { OrganizerDashboard } from "@/components/organizer/organizer-dashboard"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Панель организатора | СЦР",
  description: "Управление соревнованиями и регистрациями участников",
}

export default async function OrganizerPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ORGANIZER") {
    redirect("/auth/login?callbackUrl=/organizer")
  }

  return <OrganizerDashboard userId={session.user.id} />
}
