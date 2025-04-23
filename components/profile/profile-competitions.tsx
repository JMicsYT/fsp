import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ProfileCompetitions({ userId }: { userId: number }) {
  // В реальном при��ожении данные будут загружаться из API
  const competitions = [
    {
      id: 1,
      title: "Всероссийская олимпиада по программированию",
      type: "Федеральное",
      status: "Завершено",
      result: "2 место",
      date: "2023-03-15",
      region: "Вся Россия",
    },
    {
      id: 2,
      title: "Московский городской хакатон",
      type: "Региональное",
      status: "Завершено",
      result: "1 место",
      date: "2023-06-20",
      region: "Москва",
    },
    {
      id: 3,
      title: "Открытый кубок по спортивному программированию",
      type: "Открытое",
      status: "Завершено",
      result: "3 место",
      date: "2023-09-10",
      region: "Без ограничений",
    },
    {
      id: 4,
      title: "Чемпионат по мобильной разработке",
      type: "Открытое",
      status: "Идет соревнование",
      result: "-",
      date: "2023-11-25",
      region: "Без ограничений",
    },
    {
      id: 5,
      title: "Санкт-Петербургский турнир программистов",
      type: "Региональное",
      status: "Регистрация",
      result: "-",
      date: "2023-12-30",
      region: "Санкт-Петербург",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мои соревнования</h3>
        <Link href="/competitions">
          <Button variant="outline">Найти соревнования</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Результат</TableHead>
            <TableHead>Дата</TableHead>
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
                    competition.status === "Завершено"
                      ? "outline"
                      : competition.status === "Идет соревнование"
                        ? "default"
                        : "secondary"
                  }
                >
                  {competition.status}
                </Badge>
              </TableCell>
              <TableCell>{competition.result}</TableCell>
              <TableCell>{new Date(competition.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Link href={`/competitions/${competition.id}`}>
                  <Button variant="ghost" size="sm">
                    Подробнее
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
