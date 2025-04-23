import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

export function UpcomingCompetitions() {
  // Это демо-данные, в реальном приложении они будут загружаться из API
  const competitions = [
    {
      id: 1,
      title: "Всероссийский турнир по футболу",
      type: "Федеральное",
      discipline: "Футбол",
      registrationStart: "2023-11-01",
      registrationEnd: "2023-11-30",
      eventStart: "2023-12-15",
      eventEnd: "2023-12-17",
      region: "Вся Россия",
      maxParticipants: 500,
      currentParticipants: 320,
    },
    {
      id: 2,
      title: "Московский городской турнир по баскетболу",
      type: "Региональное",
      discipline: "Баскетбол",
      registrationStart: "2023-11-05",
      registrationEnd: "2023-11-25",
      eventStart: "2023-12-10",
      eventEnd: "2023-12-11",
      region: "Москва",
      maxParticipants: 200,
      currentParticipants: 150,
    },
    {
      id: 3,
      title: "Открытый кубок по волейболу",
      type: "Открытое",
      discipline: "Волейбол",
      registrationStart: "2023-11-10",
      registrationEnd: "2023-12-05",
      eventStart: "2023-12-20",
      eventEnd: "2023-12-21",
      region: "Без ограничений",
      maxParticipants: 300,
      currentParticipants: 180,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
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
              <Badge variant="outline" className="ml-2">
                {competition.discipline}
              </Badge>
            </div>
            <CardTitle className="mt-2">{competition.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Регистрация: {new Date(competition.registrationStart).toLocaleDateString()} -{" "}
                  {new Date(competition.registrationEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Проведение: {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                  {new Date(competition.eventEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{competition.region}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Участников: {competition.currentParticipants} / {competition.maxParticipants}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/competitions/${competition.id}`} className="w-full">
              <Button className="w-full">Подробнее</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
