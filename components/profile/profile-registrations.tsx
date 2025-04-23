"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface Registration {
  id: string
  competitionId: string
  competitionTitle: string
  competitionType: string
  competitionRegion: string
  competitionStart: string
  competitionEnd: string
  status: string
  teamId?: string
  teamName?: string
}

export function ProfileRegistrations({ userId }: { userId: string }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`/api/registrations?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setRegistrations(data)
        } else {
          throw new Error("Failed to fetch registrations")
        }
      } catch (error) {
        console.error("Error fetching registrations:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить регистрации",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchRegistrations()
    }
  }, [userId, toast])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
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

  // Mock data until API is ready
  const mockRegistrations: Registration[] = [
    {
      id: "reg_1",
      competitionId: "comp_1",
      competitionTitle: "Всероссийский турнир по футболу",
      competitionType: "OPEN",
      competitionRegion: "Москва",
      competitionStart: "2023-12-15T10:00:00Z",
      competitionEnd: "2023-12-17T18:00:00Z",
      status: "CONFIRMED",
      teamId: "team_1",
      teamName: "Динамо",
    },
    {
      id: "reg_2",
      competitionId: "comp_2",
      competitionTitle: "Московский городской турнир по баскетболу",
      competitionType: "REGIONAL",
      competitionRegion: "Москва",
      competitionStart: "2024-01-20T09:00:00Z",
      competitionEnd: "2024-01-21T19:00:00Z",
      status: "PENDING",
    },
  ]

  const displayRegistrations = registrations.length > 0 ? registrations : mockRegistrations

  if (displayRegistrations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Регистрации не найдены</h3>
        <p className="text-muted-foreground mb-6">Вы еще не зарегистрировались ни на одно соревнование</p>
        <Link href="/competitions">
          <Button>Найти соревнования</Button>
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="default">Подтверждена</Badge>
      case "PENDING":
        return <Badge variant="secondary">На рассмотрении</Badge>
      case "REJECTED":
        return <Badge variant="destructive">Отклонена</Badge>
      case "CANCELLED":
        return <Badge variant="outline">Отменена</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {displayRegistrations.map((registration) => (
        <Card key={registration.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                <Link href={`/competitions/${registration.competitionId}`} className="hover:underline">
                  {registration.competitionTitle}
                </Link>
              </CardTitle>
              {getStatusBadge(registration.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{registration.competitionRegion}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {new Date(registration.competitionStart).toLocaleDateString()} -{" "}
                  {new Date(registration.competitionEnd).toLocaleDateString()}
                </span>
              </div>
              {registration.teamId && (
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    Команда:{" "}
                    <Link href={`/teams/${registration.teamId}`} className="font-medium hover:underline">
                      {registration.teamName}
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {registration.status === "CONFIRMED" ? (
              <Button variant="outline" className="w-full">
                Подробнее
              </Button>
            ) : registration.status === "PENDING" ? (
              <Button variant="outline" className="w-full" disabled>
                Ожидание подтверждения
              </Button>
            ) : (
              <Button variant="outline" className="w-full">
                Зарегистрироваться снова
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
