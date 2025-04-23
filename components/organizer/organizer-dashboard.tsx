"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizerCompetitions } from "@/components/organizer/organizer-competitions"
import { OrganizerRegistrations } from "@/components/organizer/organizer-registrations"
import { OrganizerCreateCompetition } from "@/components/organizer/organizer-create-competition"
import { OrganizerStats } from "@/components/organizer/organizer-stats"
import { useToast } from "@/hooks/use-toast"

interface OrganizerDashboardProps {
  userId: string
}

export function OrganizerDashboard({ userId }: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState("competitions")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCompetitions: 0,
    activeCompetitions: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/organizer/stats?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить статистику",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId, toast])

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель организатора</h1>
          <p className="text-muted-foreground">Управление соревнованиями и регистрациями участников</p>
        </div>

        <OrganizerStats stats={stats} isLoading={isLoading} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="competitions">Мои соревнования</TabsTrigger>
            <TabsTrigger value="registrations">Заявки на участие</TabsTrigger>
            <TabsTrigger value="create">Создать соревнование</TabsTrigger>
          </TabsList>
          <TabsContent value="competitions" className="mt-6">
            <OrganizerCompetitions userId={userId} />
          </TabsContent>
          <TabsContent value="registrations" className="mt-6">
            <OrganizerRegistrations userId={userId} />
          </TabsContent>
          <TabsContent value="create" className="mt-6">
            <OrganizerCreateCompetition userId={userId} onSuccess={() => setActiveTab("competitions")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
