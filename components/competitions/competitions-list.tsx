// components/competitions/competitions-list.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface Competition {
  id: string
  title: string
  type: string
  discipline: string
  region: string
  registrationStart: string
  registrationEnd: string
  eventStart: string
  eventEnd: string
  currentParticipants: number
  maxParticipants: number | null
  status: string
}

export function CompetitionsList() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true)
        // Собираем параметры фильтрации
        const qp = new URLSearchParams()
        const search = searchParams.get("search")
        if (search) qp.append("search", search)

        const types = searchParams.getAll("type")
        types.forEach((t) => qp.append("type", t))

        const discipline = searchParams.get("discipline")
        if (discipline && discipline !== "all") qp.append("discipline", discipline)

        const region = searchParams.get("region")
        if (region && region !== "all") qp.append("region", region)

        const status = searchParams.get("status")
        if (status && status !== "all") qp.append("status", status)

        const from = searchParams.get("fromDate")
        if (from) qp.append("fromDate", from)

        const to = searchParams.get("toDate")
        if (to) qp.append("toDate", to)

        // Запрашиваем внутренний Next.js API
        const url = `/api/competitions${qp.toString() ? `?${qp.toString()}` : ""}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }

        const data: Competition[] = await response.json()
        setCompetitions(data)
      } catch (error: any) {
        console.error("Error loading competitions:", error)
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось загрузить соревнования",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [searchParams, toast])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  if (competitions.length === 0) {
    return <div className="text-center py-16 text-muted-foreground">Соревнования не найдены</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id}>
          <CardHeader>
            <CardTitle>{competition.title}</CardTitle>
            <Badge>{competition.type}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(competition.eventStart).toLocaleDateString()}–{" "}
                {new Date(competition.eventEnd).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>{competition.region}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>
                {competition.currentParticipants}
                {competition.maxParticipants && ` / ${competition.maxParticipants}`}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/competitions/${competition.id}`}>
              <Button variant="outline">Подробнее</Button>
            </Link>
            {competition.status === "REGISTRATION_OPEN" && (
              <Link href={`/competitions/register/${competition.id}`}>
                <Button>Регистрация</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
