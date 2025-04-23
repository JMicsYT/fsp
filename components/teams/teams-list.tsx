"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Trophy, Plus, Eye, Settings } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

// Тип для команды
interface Team {
  id: string
  name: string
  competitionId: string
  competitionTitle: string
  captainId: string
  captainName: string
  status: string
  memberCount: number
}

export function TeamsList() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams")
        if (response.ok) {
          const data = await response.json()
          setTeams(data)
        } else {
          throw new Error("Failed to fetch teams")
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить команды",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [toast])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Temporary mock data until API is ready
  const mockTeams: Team[] = [
    {
      id: "team_1",
      name: "Динамо",
      competitionId: "comp_1",
      competitionTitle: "Всероссийский турнир по футболу",
      captainId: "usr_ath1",
      captainName: "Иван Петров",
      status: "CONFIRMED",
      memberCount: 2,
    },
    {
      id: "team_2",
      name: "Спартак",
      competitionId: "comp_1",
      competitionTitle: "Всероссийский турнир по футболу",
      captainId: "usr_ath2",
      captainName: "Анна Сидорова",
      status: "CONFIRMED",
      memberCount: 2,
    },
    {
      id: "team_3",
      name: "ЦСКА",
      competitionId: "comp_2",
      competitionTitle: "Московский городской турнир по баскетболу",
      captainId: "usr_ath3",
      captainName: "Дмитрий Волков",
      status: "CONFIRMED",
      memberCount: 1,
    },
    {
      id: "team_4",
      name: "Зенит",
      competitionId: "comp_3",
      competitionTitle: "Открытый кубок по волейболу",
      captainId: "usr_ath4",
      captainName: "Елена Смирнова",
      status: "NEEDS_MEMBERS",
      memberCount: 1,
    },
  ]

  const displayTeams = teams.length > 0 ? teams : mockTeams

  if (displayTeams.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Команды не найдены</h3>
        <p className="text-muted-foreground mb-6">У вас пока нет команд</p>
        <Link href="/teams/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Создать команду
          </Button>
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="default">Подтверждена</Badge>
      case "NEEDS_MEMBERS":
        return <Badge variant="secondary">Требуются участники</Badge>
      case "PENDING":
        return <Badge variant="outline">На модерации</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Check if user is admin or organizer
  const isAdminOrOrganizer = session?.user?.role === "ADMIN" || session?.user?.role === "ORGANIZER"

  // Check if user is captain of the team
  const isCaptain = (captainId: string) => session?.user?.id === captainId

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayTeams.map((team) => (
        <Card key={team.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{team.name}</CardTitle>
              {getStatusBadge(team.status)}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                <Link href={`/competitions/${team.competitionId}`} className="hover:underline">
                  {team.competitionTitle}
                </Link>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Участников: {team.memberCount} / 3</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={team.captainName} />
                  <AvatarFallback>{team.captainName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Капитан</p>
                  <p className="text-sm">{team.captainName}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isAdminOrOrganizer || isCaptain(team.captainId) ? (
              <Link href={`/teams/${team.id}`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Управление командой
                </Button>
              </Link>
            ) : (
              <Link href={`/teams/${team.id}/view`} className="w-full">
                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотр команды
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
