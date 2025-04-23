import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function CompetitionResults({ competitionId }: { competitionId: number }) {
  // В реальном приложении данные будут загружаться из API
  const results = [
    {
      place: 1,
      teamId: 1,
      teamName: "Алгоритмические гении",
      score: 950,
      solvedTasks: 9,
      timeSpent: "04:23:15",
    },
    {
      place: 2,
      teamId: 2,
      teamName: "Кодеры",
      score: 920,
      solvedTasks: 9,
      timeSpent: "04:45:30",
    },
    {
      place: 3,
      teamId: 5,
      teamName: "Байтовые волшебники",
      score: 850,
      solvedTasks: 8,
      timeSpent: "04:12:45",
    },
    {
      place: 4,
      teamId: 8,
      teamName: "Логические мастера",
      score: 800,
      solvedTasks: 8,
      timeSpent: "04:30:20",
    },
    {
      place: 5,
      teamId: 4,
      teamName: "Рекурсивные мыслители",
      score: 750,
      solvedTasks: 7,
      timeSpent: "04:15:10",
    },
    {
      place: 6,
      teamId: 10,
      teamName: "Цифровые стратеги",
      score: 700,
      solvedTasks: 7,
      timeSpent: "04:40:55",
    },
    {
      place: 7,
      teamId: 3,
      teamName: "Битовые маги",
      score: 650,
      solvedTasks: 6,
      timeSpent: "04:05:30",
    },
    {
      place: 8,
      teamId: 7,
      teamName: "Кодовые архитекторы",
      score: 600,
      solvedTasks: 6,
      timeSpent: "04:25:15",
    },
  ]

  // Проверка, завершено ли соревнование
  const isCompetitionFinished = false

  if (!isCompetitionFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-bold mb-2">Соревнование еще не завершено</h3>
        <p className="text-muted-foreground">Результаты будут доступны после завершения соревнования.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Результаты соревнования</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Место</TableHead>
            <TableHead>Команда</TableHead>
            <TableHead className="text-right">Баллы</TableHead>
            <TableHead className="text-right">Решено задач</TableHead>
            <TableHead className="text-right">Затраченное время</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.teamId}>
              <TableCell className="font-medium">
                {result.place <= 3 ? (
                  <Badge variant={result.place === 1 ? "default" : result.place === 2 ? "secondary" : "outline"}>
                    {result.place}
                  </Badge>
                ) : (
                  result.place
                )}
              </TableCell>
              <TableCell>{result.teamName}</TableCell>
              <TableCell className="text-right">{result.score}</TableCell>
              <TableCell className="text-right">{result.solvedTasks}</TableCell>
              <TableCell className="text-right">{result.timeSpent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
