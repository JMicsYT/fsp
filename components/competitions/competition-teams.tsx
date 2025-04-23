import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CompetitionTeams({ competitionId }: { competitionId: number }) {
  // В реальном приложении данные будут загружаться из API
  const teams = [
    {
      id: 1,
      name: "Алгоритмические гении",
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
          id: 202,
          name: "Алексей Козлов",
          avatar: "/avatars/05.png",
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
          id: 302,
          name: "Мария Кузнецова",
          avatar: "/avatars/08.png",
        },
      ],
      status: "Требуются участники",
    },
    {
      id: 4,
      name: "Рекурсивные мыслители",
      captain: {
        id: 401,
        name: "Сергей Морозов",
        avatar: "/avatars/09.png",
      },
      members: [
        {
          id: 401,
          name: "Сергей Морозов",
          avatar: "/avatars/09.png",
        },
        {
          id: 402,
          name: "Екатерина Белова",
          avatar: "/avatars/10.png",
        },
        {
          id: 403,
          name: "Андрей Соколов",
          avatar: "/avatars/11.png",
        },
      ],
      status: "На модерации",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Команды участников</h3>
        <Button>Создать команду</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{team.name}</CardTitle>
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
              {team.status === "Требуются участники" ? (
                <Button className="w-full" variant="outline">
                  Подать заявку
                </Button>
              ) : (
                <Link href={`/teams/${team.id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    Подробнее
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
