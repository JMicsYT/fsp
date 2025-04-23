import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

export function AdminCompetitions() {
  // В реальном приложении данные будут загружаться из API
  const competitions = [
    {
      id: 1,
      title: "Всероссийская олимпиада по программированию",
      type: "Федеральное",
      status: "Открыта регистрация",
      eventStart: "2023-12-15",
      eventEnd: "2023-12-17",
      region: "Вся Россия",
      teamsCount: 32,
    },
    {
      id: 2,
      title: "Московский городской хакатон",
      type: "Региональное",
      status: "Открыта регистрация",
      eventStart: "2023-12-10",
      eventEnd: "2023-12-11",
      region: "Москва",
      teamsCount: 15,
    },
    {
      id: 3,
      title: "Открытый кубок по спортивному программированию",
      type: "Открытое",
      status: "Открыта регистрация",
      eventStart: "2023-12-20",
      eventEnd: "2023-12-21",
      region: "Без ограничений",
      teamsCount: 18,
    },
    {
      id: 4,
      title: "Чемпионат по мобильной разработке",
      type: "Открытое",
      status: "На модерации",
      eventStart: "2023-12-25",
      eventEnd: "2023-12-26",
      region: "Без ограничений",
      teamsCount: 0,
    },
    {
      id: 5,
      title: "Санкт-Петербургский турнир программистов",
      type: "Региональное",
      status: "На модерации",
      eventStart: "2023-12-30",
      eventEnd: "2023-12-31",
      region: "Санкт-Петербург",
      teamsCount: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск соревнований..." className="pl-8" />
        </div>
        <Link href="/competitions/create">
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
            <TableHead>Регион</TableHead>
            <TableHead>Команд</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitions.map((competition) => (
            <TableRow key={competition.id}>
              <TableCell className="font-medium">{competition.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    competition.type === "Федеральное"
                      ? "default"
                      : competition.type === "Региональное"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {competition.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    competition.status === "Открыта регистрация"
                      ? "default"
                      : competition.status === "На модерации"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {competition.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                {new Date(competition.eventEnd).toLocaleDateString()}
              </TableCell>
              <TableCell>{competition.region}</TableCell>
              <TableCell>{competition.teamsCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                  <Button variant="ghost" size="sm">
                    Редактировать
                  </Button>
                  {competition.status === "На модерации" && (
                    <Button variant="default" size="sm">
                      Утвердить
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
