import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy } from "lucide-react"

export function ProfileAchievements({ userId }: { userId: number }) {
  // В реальном приложении данные будут загружаться из API
  const achievements = [
    {
      id: 1,
      title: "Всероссийская олимпиада по программированию",
      place: 2,
      date: "2023-03-15",
      points: 150,
    },
    {
      id: 2,
      title: "Московский городской хакатон",
      place: 1,
      date: "2023-06-20",
      points: 200,
    },
    {
      id: 3,
      title: "Открытый кубок по спортивному программированию",
      place: 3,
      date: "2023-09-10",
      points: 100,
    },
    {
      id: 4,
      title: "Региональный чемпионат по программированию",
      place: 5,
      date: "2022-11-15",
      points: 50,
    },
    {
      id: 5,
      title: "Студенческая олимпиада по алгоритмам",
      place: 2,
      date: "2022-05-20",
      points: 150,
    },
  ]

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Мои достижения</h3>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-bold">{totalPoints} баллов</span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Соревнование</TableHead>
            <TableHead>Место</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="text-right">Баллы</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.map((achievement) => (
            <TableRow key={achievement.id}>
              <TableCell className="font-medium">{achievement.title}</TableCell>
              <TableCell>
                {achievement.place <= 3 ? (
                  <Badge
                    variant={achievement.place === 1 ? "default" : achievement.place === 2 ? "secondary" : "outline"}
                  >
                    {achievement.place} место
                  </Badge>
                ) : (
                  `${achievement.place} место`
                )}
              </TableCell>
              <TableCell>{new Date(achievement.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">{achievement.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
