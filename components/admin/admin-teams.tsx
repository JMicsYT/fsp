"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Edit, Trash2, Eye, Search, UserPlus } from "lucide-react"
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

export function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/admin/teams")
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

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/admin/teams/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTeams((prev) => prev.filter((team) => team.id !== deleteId))
        toast({
          title: "Успешно",
          description: "Команда удалена",
        })
      } else {
        throw new Error("Failed to delete team")
      }
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить команду",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
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

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.competitionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captainName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || team.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Управление командами</h3>
        <Link href="/admin/teams/create">
          <Button>
            <Users className="mr-2 h-4 w-4" />
            Создать команду
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, соревнованию или капитану"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="CONFIRMED">Подтверждена</SelectItem>
            <SelectItem value="NEEDS_MEMBERS">Требуются участники</SelectItem>
            <SelectItem value="PENDING">На модерации</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-2">Команды не найдены</h3>
          <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Соревнование</TableHead>
              <TableHead>Капитан</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Участники</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>
                  <Link href={`/competitions/${team.competitionId}`} className="hover:underline">
                    {team.competitionTitle}
                  </Link>
                </TableCell>
                <TableCell>{team.captainName}</TableCell>
                <TableCell>{getStatusBadge(team.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{team.memberCount} / 3</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/teams/${team.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Просмотр</span>
                      </Button>
                    </Link>
                    <Link href={`/admin/teams/${team.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                    <Link href={`/admin/teams/${team.id}/members`}>
                      <Button variant="ghost" size="icon">
                        <UserPlus className="h-4 w-4" />
                        <span className="sr-only">Управление участниками</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(team.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Удалить</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Команда будет удалена вместе со всеми связанными данными.
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
