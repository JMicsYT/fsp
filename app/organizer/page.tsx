// app/organizer/page.tsx
import { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { OrganizerDashboard } from "@/components/organizer/organizer-dashboard"

export const metadata: Metadata = {
  title: "Панель организатора | СЦР",
  description: "Управление соревнованиями и регистрациями участников",
}

export default async function OrganizerPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login?callbackUrl=/organizer")
  }
  return <OrganizerDashboard userId={session.user.id} />
}
