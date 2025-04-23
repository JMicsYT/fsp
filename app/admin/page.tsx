import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminCompetitions } from "@/components/admin/admin-competitions"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminAnalytics } from "@/components/admin/admin-analytics"

export const metadata: Metadata = {
  title: "Панель администратора | Платформа соревнований по спорту",
  description: "Панель администратора для управления платформой СЦР",
}

export default function AdminPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Панель администратора</h1>
          <p className="text-muted-foreground">Управление соревнованиями, пользователями и аналитика</p>
        </div>

        <Tabs defaultValue="competitions">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="competitions">Соревнования</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>
          <TabsContent value="competitions" className="mt-6">
            <AdminCompetitions />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <AdminUsers />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
