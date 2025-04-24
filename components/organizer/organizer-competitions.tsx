// components/organizer/organizer-competitions.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, Users, Edit, Eye, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface Competition {
  id: string
  title: string
  type: "OPEN" | "REGIONAL" | "FEDERAL"
  discipline: string
  eventStart: string
  eventEnd: string
  registrationCount: number
}

export function OrganizerCompetitions({ userId }: { userId: string }) {
  const [items, setItems] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/organizer/competitions?organizerId=${encodeURIComponent(userId)}`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data: Competition[] = await res.json()
        setItems(data)
      } catch (err) {
        console.error(err)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить соревнования",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchList()
  }, [userId, toast])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/competitions/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((c) => c.id !== id))
      toast({ title: "Соревнование удалено" })
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить соревнование",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        У вас пока нет соревнований
        <div className="mt-4">
          <Link href="/competitions/create">
            <Button>Создать соревнование</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Тип</TableHead>
          <TableHead>Дисциплина</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Участники</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.title}</TableCell>
            <TableCell>{c.type}</TableCell>
            <TableCell>{c.discipline}</TableCell>
            <TableCell>
              <Calendar className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
              {new Date(c.eventStart).toLocaleDateString()}–{" "}
              {new Date(c.eventEnd).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Users className="inline-block mr-1 h-4 w-4 text-muted-foreground" />
              {c.registrationCount}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/competitions/${c.id}`}>
                <Button size="icon" variant="ghost" title="Просмотр">
                  <Eye size={16} />
                </Button>
              </Link>
              <Link href={`/competitions/${c.id}/edit`}>
                <Button size="icon" variant="ghost" title="Редактировать">
                  <Edit size={16} />
                </Button>
              </Link>

              {/* Correct AlertDialog structure */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" title="Удалить">
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить соревнование?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Все данные будут безвозвратно удалены.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground"
                      onClick={() => handleDelete(c.id)}
                    >
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
