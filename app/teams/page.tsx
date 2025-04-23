import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TeamsList } from "@/components/teams/teams-list"

export const metadata: Metadata = {
  title: "Команды | СЦР",
  description: "Управление командами на платформе СЦР",
}

export default function TeamsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Команды</h1>
            <p className="text-muted-foreground">Управление командами и участие в соревнованиях</p>
          </div>
          <Link href="/teams/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Создать команду
            </Button>
          </Link>
        </div>

        <TeamsList />
      </div>
    </div>
  )
}
