import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { TeamView } from "@/components/teams/team-view"

interface TeamViewPageProps {
  params: {
    id: string
  }
}

export default async function TeamViewPage({ params }: TeamViewPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/auth/login?callbackUrl=/teams/${params.id}/view`)
  }

  return <TeamView teamId={params.id} userId={session.user.id} userRole={session.user.role} />
}
