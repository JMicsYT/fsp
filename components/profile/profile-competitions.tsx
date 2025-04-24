"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface Competition {
  id: string
  title: string
  type: string
  discipline: string
  region: string
  eventStart: string
  eventEnd: string
  status: string
}

export function ProfileCompetitions({ userId }: { userId: string }) {
  const [items, setItems] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/organizer/competitions?userId=${encodeURIComponent(userId)}`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data: Competition[] = await res.json()
        setItems(data)
      } catch (err) {
        console.error("Error loading profile competitions:", err)
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

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((c) => (
        <div key={c.id} className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <Badge>{c.type}</Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {c.discipline}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="mr-1" size={14} />
            {new Date(c.eventStart).toLocaleDateString()} –{" "}
            {new Date(c.eventEnd).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="mr-1" size={14} />
            {c.region}
          </div>
          <Link href={`/competitions/${c.id}`}>
            <Button size="sm">Подробнее</Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
