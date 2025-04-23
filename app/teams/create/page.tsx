"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Competition {
  id: string
  title: string
}

export default function CreateTeamPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [formData, setFormData] = useState({
    name: "",
    competitionId: "",
  })

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("/api/competitions?status=REGISTRATION_OPEN")
        if (response.ok) {
          const data = await response.json()
          setCompetitions(data)
        } else {
          throw new Error("Failed to fetch competitions")
        }
      } catch (error) {
        console.error("Error fetching competitions:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список соревнований",
          variant: "destructive",
        })
      }
    }

    fetchCompetitions()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему для создания команды",
        variant: "destructive",
      })
      router.push("/auth/login?callbackUrl=/teams/create")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          captainId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Успешно",
          description: "Команда успешно создана",
        })
        router.push(`/teams/${data.id}`)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create team")
      }
    } catch (error: any) {
      console.error("Error creating team:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать команду",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Создание команды</h1>
          <p className="text-muted-foreground">Создайте новую команду для участия в соревновании</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация о команде</CardTitle>
            <CardDescription>Заполните необходимые данные для создания команды</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название команды *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите название команды"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitionId">Соревнование *</Label>
                <Select
                  value={formData.competitionId}
                  onValueChange={(value) => handleSelectChange("competitionId", value)}
                  required
                >
                  <SelectTrigger id="competitionId">
                    <SelectValue placeholder="Выберите соревнование" />
                  </SelectTrigger>
                  <SelectContent>
                    {competitions.map((competition) => (
                      <SelectItem key={competition.id} value={competition.id}>
                        {competition.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!session?.user && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Для создания команды необходимо войти в систему.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading || !session?.user}>
                {isLoading ? "Создание..." : "Создать команду"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
