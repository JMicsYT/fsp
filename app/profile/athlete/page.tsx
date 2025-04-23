import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AthleteProfile } from "@/components/profile/athlete-profile"

export default async function AthleteProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/profile/athlete")
  }

  if (session.user.role !== "ATHLETE") {
    redirect("/profile")
  }

  return <AthleteProfile userId={session.user.id} />
}
