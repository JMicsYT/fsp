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

// Type for competition
interface Competition {
  id: string
  title: string
  type: string
  discipline: string
  registrationStart: string
  registrationEnd: string
  eventStart: string
  eventEnd: string
  region: string
  maxParticipants: number | null
  currentParticipants: number
  status: string
}

export function CompetitionsList() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setIsLoading(true)

        // Build query string from search params
        const queryParams = new URLSearchParams()

        const search = searchParams?.get("search")
        if (search) queryParams.append("search", search)

        const types = searchParams?.getAll("type")
        types.forEach((type) => queryParams.append("type", type))

        const discipline = searchParams?.get("discipline")
        if (discipline && discipline !== "all") queryParams.append("discipline", discipline)

        const region = searchParams?.get("region")
        if (region && region !== "all") queryParams.append("region", region)

        const statuses = searchParams?.getAll("status")
        statuses.forEach((status) => queryParams.append("status", status))

        const fromDate = searchParams?.get("fromDate")
        if (fromDate) queryParams.append("fromDate", fromDate)

        const toDate = searchParams?.get("toDate")
        if (toDate) queryParams.append("toDate", toDate)

        // Make the API request
        const url = `/api/competitions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          // Ensure data is an array before setting it
          if (Array.isArray(data)) {
            setCompetitions(data)
          } else {
            console.error("Expected array but got:", data)
            setCompetitions([])
          }
        } else {
          throw new Error("Failed to fetch competitions")
        }
      } catch (error) {
        console.error("Error fetching competitions:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить соревнования",
          variant: "destructive",
        })
        // Set empty array on error
        setCompetitions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [toast, searchParams])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-full mt-2" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
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

  if (!competitions || competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Соревнования не найдены</h3>
        <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return <Badge variant="default">Открыта регистрация</Badge>
      case "REGISTRATION_CLOSED":
        return <Badge variant="secondary">Регистрация закрыта</Badge>
      case "IN_PROGRESS":
        return (
          <Badge variant="default" className="bg-green-600">
            Идет соревнование
          </Badge>
        )
      case "COMPLETED":
        return <Badge variant="outline">Завершено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "FEDERAL":
        return <Badge variant="default">Федеральное</Badge>
      case "REGIONAL":
        return <Badge variant="secondary">Региональное</Badge>
      case "OPEN":
        return <Badge variant="outline">Открытое</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              {getTypeBadge(competition.type)}
              <Badge variant="outline">{competition.discipline}</Badge>
            </div>
            <CardTitle className="mt-2">{competition.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Регистрация: {new Date(competition.registrationStart).toLocaleDateString()} -{" "}
                  {new Date(competition.registrationEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Проведение: {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                  {new Date(competition.eventEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{competition.region}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Участников: {competition.currentParticipants} / {competition.maxParticipants || "∞"}
                </span>
              </div>
              <div>{getStatusBadge(competition.status)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link href={`/competitions/${competition.id}`} className="flex-1">
              <Button className="w-full" variant="outline">
                Подробнее
              </Button>
            </Link>
            {competition.status === "REGISTRATION_OPEN" && (
              <Link href={`/competitions/register/${competition.id}`} className="flex-1">
                <Button className="w-full">Регистрация</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
