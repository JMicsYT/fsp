import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileTeams({ userId }: { userId: number }) {
  // В реальном приложении данные будут загружаться из API
  const teams = [
    {
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
    },
    {
      id: 2,
      name: "Кодеры",
      competition: {
        id: 2,
        title: "Московский городской хакатон",
      },
      captain: {
        id: 201,
        name: "Елена Смирнова",
        avatar: "/avatars/04.png",
      },
      members: [
        {
          id: 201,
          name: "Елена Смирнова",
          avatar: "/avatars/04.png",
        },
        {
          id: 101,
          name: "Иван Петров",
          avatar: "/avatars/01.png",
        },
        {
          id: 203,
          name: "Ольга Новикова",
          avatar: "/avatars/06.png",
        },
      ],
      status: "Подтверждена",
    },
    {
      id: 3,
      name: "Битовые маги",
      competition: {
        id: 3,
        title: "Открытый кубок по спортивному программированию",
      },
      captain: {
        id: 301,
        name: "Дмитрий Волков",
        avatar: "/avatars/07.png",
      },
      members: [
        {
          id: 301,
          name: "Дмитрий Волков",
          avatar: "/avatars/07.png",
        },
        {
          id: 101,
          name: "Иван Петров",
          avatar: "/avatars/01.png",
        },
      ],
      status: "Требуются участники",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мои команды</h3>
        <Link href="/competitions">
          <Button variant="outline">Создать команду</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <Link
                    href={`/competitions/${team.competition.id}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {team.competition.title}
                  </Link>
                </div>
                <Badge
                  variant={
                    team.status === "Подтверждена"
                      ? "default"
                      : team.status === "На модерации"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {team.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Капитан:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={team.captain.avatar || "/placeholder.svg"} alt={team.captain.name} />
                      <AvatarFallback>{team.captain.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{team.captain.name}</span>
                    {team.captain.id === userId && (
                      <Badge variant="outline" className="ml-2">
                        Вы
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Участники ({team.members.length}/3):</p>
                  <div className="flex flex-col gap-2 mt-1">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                        {member.id === userId && (
                          <Badge variant="outline" className="ml-2">
                            Вы
                          </Badge>
                        )}
                      </div>
                    ))}
                    {team.members.length < 3 && (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">+</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Свободное место</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/teams/${team.id}`} className="w-full">
                <Button className="w-full" variant="outline">
                  Управление командой
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
