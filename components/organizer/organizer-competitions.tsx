"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Users, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Competition {
  id: string
  title: string
  type: "OPEN" | "REGIONAL" | "FEDERAL"
  discipline: string
  region: string
  registrationStart: string
  registrationEnd: string
  eventStart: string
  eventEnd: string
  status: string
  currentParticipants: number
  maxParticipants: number | null
}

export function OrganizerCompetitions({ userId }: { userId: string }) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch(`/api/organizer/competitions?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setCompetitions(data)
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [userId, toast])

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/competitions/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCompetitions((prev) => prev.filter((comp) => comp.id !== deleteId))
        toast({
          title: "Успешно",
          description: "Соревнование удалено",
        })
      } else {
        throw new Error("Failed to delete competition")
      }
    } catch (error) {
      console.error("Error deleting competition:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить соревнование",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
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
      case "DRAFT":
        return <Badge variant="outline">Черновик</Badge>
      case "MODERATION":
        return <Badge variant="secondary">На модерации</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Отменено</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: "OPEN" | "REGIONAL" | "FEDERAL") => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">У вас пока нет соревнований</h3>
        <p className="text-muted-foreground mb-6">Создайте свое первое соревнование прямо сейчас</p>
        <Link href="/organizer?tab=create">
          <Button>Создать соревнование</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мои соревнования</h3>
        <Link href="/organizer?tab=create">
          <Button>Создать соревнование</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Даты проведения</TableHead>
            <TableHead>Участники</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitions.map((competition) => (
            <TableRow key={competition.id}>
              <TableCell className="font-medium">{competition.title}</TableCell>
              <TableCell>{getTypeBadge(competition.type)}</TableCell>
              <TableCell>{getStatusBadge(competition.status)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>
                      {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                      {new Date(competition.eventEnd).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{competition.region}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {competition.currentParticipants} / {competition.maxParticipants || "∞"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/competitions/${competition.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Просмотр</span>
                    </Button>
                  </Link>
                  <Link href={`/organizer/competitions/${competition.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Редактировать</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(competition.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Удалить</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Соревнование будет удалено вместе со всеми связанными данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
