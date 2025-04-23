"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, Info } from "lucide-react"
import { CompetitionTeams } from "@/components/competitions/competition-teams"
import { CompetitionResults } from "@/components/competitions/competition-results"

export default function CompetitionDetailsClientPage({ params }: { params: { id: string } }) {
  const [competition, setCompetition] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch competition data only once when component mounts
    const fetchCompetition = async () => {
      try {
        // For now, use mock data
        setCompetition({
          id: 1,
          title: "Всероссийская олимпиада по программированию",
          type: "Федеральное",
          discipline: "Алгоритмическое программирование",
          registrationStart: "2025-11-01",
          registrationEnd: "2025-11-30",
          eventStart: "2025-12-15",
          eventEnd: "2025-12-17",
          region: "Вся Россия",
          maxParticipants: 500,
          currentParticipants: 320,
          description: `
            Всероссийская олимпиада по программированию - это престижное соревнование для талантливых программистов со всей России.
            
            Участники будут решать алгоритмические задачи различной сложности, демонстрируя свои навыки в области программирования и алгоритмического мышления.
            
            Соревнование проводится в несколько этапов, включая отборочный тур и финал. Победители получат ценные призы и возможность представлять Россию на международных соревнованиях.
          `,
          rules: `
            1. Участники должны быть гражданами Российской Федерации.
            2. Возраст участников: от 16 до 25 лет.
            3. Команда состоит из 3 человек.
            4. Каждая команда должна иметь капитана.
            5. Во время соревнования запрещается использование интернета (кроме официального сайта соревнования).
            6. Запрещается общение с людьми вне команды во время соревнования.
            7. Решения должны быть написаны на одном из следующих языков: C++, Java, Python.
          `,
          organizer: {
            name: "Федерация спортивного программирования России",
            contact: "info@fspr.ru",
            website: "https://fspr.ru",
          },
          status: "Открыта регистрация",
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching competition:", error)
        setLoading(false)
      }
    }

    fetchCompetition()
  }, [params.id]) // Only re-run if the competition ID changes

  if (loading) {
    return <div>Loading...</div>
  }

  if (!competition) {
    return <div>Competition not found</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
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
            <Badge variant="outline">{competition.discipline}</Badge>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              {competition.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{competition.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  Регистрация: {new Date(competition.registrationStart).toLocaleDateString()} -{" "}
                  {new Date(competition.registrationEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  Проведение: {new Date(competition.eventStart).toLocaleDateString()} -{" "}
                  {new Date(competition.eventEnd).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{competition.region}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  Участников: {competition.currentParticipants} / {competition.maxParticipants}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Организатор: {competition.organizer.name}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Контакт: {competition.organizer.contact}</span>
              </div>
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Сайт: {competition.organizer.website}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  До начала регистрации:{" "}
                  {Math.floor(
                    (new Date(competition.registrationStart).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )}{" "}
                  дней
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button>Зарегистрироваться</Button>
            <Button variant="outline">Создать команду</Button>
            <Button variant="outline">Найти команду</Button>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="rules">Правила</TabsTrigger>
            <TabsTrigger value="teams">Команды</TabsTrigger>
            <TabsTrigger value="results">Результаты</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Описание соревнования</h3>
              {competition.description.split("\n").map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rules" className="mt-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Правила соревнования</h3>
              {competition.rules.split("\n").map((rule: string, index: number) => (
                <p key={index}>{rule}</p>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="teams" className="mt-6">
            <CompetitionTeams competitionId={competition.id} />
          </TabsContent>
          <TabsContent value="results" className="mt-6">
            <CompetitionResults competitionId={competition.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
