"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Calendar, MapPin, ArrowLeft, Users } from "lucide-react"

interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  role: string
  isCaptain: boolean
  joinedAt: string
}

interface Team {
  id: string
  name: string
  competition: {
    id: string
    title: string
    discipline: string
    eventStart: string
    eventEnd: string
    region: string
  }
  captain: {
    id: string
    name: string
  }
  members: TeamMember[]
  status: string
  createdAt: string
}

export function TeamView({ teamId, userId, userRole }: { teamId: string; userId: string; userRole: string }) {
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`)
        if (response.ok) {
          const data = await response.json()
          setTeam(data)
        } else {
          throw new Error("Failed to fetch team")
        }
      } catch (error) {
        console.error("Error fetching team:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные команды",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeam()
  }, [teamId, toast])

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[300px] md:col-span-2" />
          </div>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-2">Команда не найдена</h3>
          <p className="text-muted-foreground mb-6">Команда не существует или у вас нет доступа</p>
          <Button onClick={() => router.push("/teams")}>Вернуться к списку команд</Button>
        </div>
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

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/teams")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к командам
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{team.name}</CardTitle>
                {getStatusBadge(team.status)}
              </div>
              <CardDescription>Создана: {new Date(team.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Соревнование:</h4>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Link href={`/competitions/${team.competition.id}`} className="hover:underline">
                    {team.competition.title}
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Дисциплина:</h4>
                <Badge variant="outline">{team.competition.discipline}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Даты проведения:</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {new Date(team.competition.eventStart).toLocaleDateString()} -{" "}
                    {new Date(team.competition.eventEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Место проведения:</h4>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{team.competition.region}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Состав команды
                </CardTitle>
                <Badge variant="outline">{team.members.length} / 3</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.isCaptain && <Badge>Капитан</Badge>}
                      {member.userId === userId && <Badge variant="outline">Вы</Badge>}
                    </div>
                  </div>
                ))}

                {team.members.length < 3 && (
                  <div className="flex items-center justify-between border p-3 rounded-md border-dashed">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg">+</span>
                      </div>
                      <div>
                        <p className="font-medium">Свободное место</p>
                        <p className="text-sm text-muted-foreground">Ожидается участник</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
