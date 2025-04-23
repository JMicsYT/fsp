import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AdminProfile } from "@/components/profile/admin-profile"

export default async function AdminProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/profile/admin")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/profile")
  }

  return <AdminProfile userId={session.user.id} />
}
