import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { OrganizerProfile } from "@/components/profile/organizer-profile"

export default async function OrganizerProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/profile/organizer")
  }

  if (session.user.role !== "ORGANIZER") {
    redirect("/profile")
  }

  return <OrganizerProfile userId={session.user.id} />
}
