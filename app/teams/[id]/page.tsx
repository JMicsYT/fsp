import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamInvites } from "@/components/teams/team-invites"
import { TeamRequests } from "@/components/teams/team-requests"

export const metadata: Metadata = {
  title: "Управление командой | Платформа соревнований по спортивному программированию",
  description: "Управление командой на платформе соревнований по спортивному программированию",
}

export default function TeamPage({ params }: { params: { id: string } }) {
  // В реальном приложении данные буд��т загружаться из API
  const team = {
    id: 1,
    name: "Алгоритмические гении",
    competition: {
      id: 1,
      title: "Всероссийская олимпиада по программированию",
    },
    captain: {
      id: 101,
      name: "Иван Петров",
      avatar: "/avatars/01.png",
    },
    members: [
      {
        id: 101,
        name: "Иван Петров",
        avatar: "/avatars/01.png",
      },
      {
        id: 102,
        name: "Анна Сидорова",
        avatar: "/avatars/02.png",
      },
      {
        id: 103,
        name: "Михаил Иванов",
        avatar: "/avatars/03.png",
      },
    ],
    status: "Подтверждена", // Подтверждена, На модерации, Требуются участники
    invites: [
      {
        id: 1,
        user: {
          id: 201,
          name: "Елена Смирнова",
          avatar: "/avatars/04.png",
        },
        status: "Ожидает ответа", // Ожидает ответа, Принято, Отклонено
        date: "2023-11-15",
      },
    ],
    requests: [
      {
        id: 1,
        user: {
          id: 301,
          name: "Дмитрий Волков",
          avatar: "/avatars/07.png",
        },
        status: "Ожидает ответа", // Ожидает ответа, Принято, Отклонено
        date: "2023-11-16",
      },
      {
        id: 2,
        user: {
          id: 302,
          name: "Мария Кузнецова",
          avatar: "/avatars/08.png",
        },
        status: "Ожидает ответа",
        date: "2023-11-17",
      },
    ],
  }

  if (!team) {
    notFound()
  }

  // Предположим, что текущий пользователь - капитан команды
  const isCurrentUserCaptain = true

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                team.status === "Подтверждена" ? "default" : team.status === "На модерации" ? "secondary" : "outline"
              }
            >
              {team.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
          <p className="text-muted-foreground">
            Команда для соревнования:{" "}
            <Link href={`/competitions/${team.competition.id}`} className="hover:underline">
              {team.competition.title}
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Информация о команде</CardTitle>
              <CardDescription>Состав и статус команды</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Капитан:</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={team.captain.avatar || "/placeholder.svg"} alt={team.captain.name} />
                    <AvatarFallback>{team.captain.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{team.captain.name}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Участники ({team.members.length}/3):</p>
                <div className="flex flex-col gap-2 mt-1">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  ))}
                  {team.members.length < 3 && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs">+</span>
                      </div>
                      <span className="text-muted-foreground">Свободное место</span>
                    </div>
                  )}
                </div>
              </div>
              {isCurrentUserCaptain && team.members.length < 3 && (
                <Button className="w-full">Пригласить участника</Button>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Управление командой</CardTitle>
              <CardDescription>Приглашения и заявки на вступление</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="invites">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="invites">Приглашения</TabsTrigger>
                  <TabsTrigger value="requests">Заявки</TabsTrigger>
                </TabsList>
                <TabsContent value="invites" className="mt-6">
                  <TeamInvites teamId={team.id} invites={team.invites} isCurrentUserCaptain={isCurrentUserCaptain} />
                </TabsContent>
                <TabsContent value="requests" className="mt-6">
                  <TeamRequests teamId={team.id} requests={team.requests} isCurrentUserCaptain={isCurrentUserCaptain} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {isCurrentUserCaptain && (
          <div className="flex justify-end gap-4">
            <Button variant="outline">Редактировать команду</Button>
            <Button variant="destructive">Расформировать команду</Button>
          </div>
        )}
      </div>
    </div>
  )
}
