"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, Medal, Trophy } from "lucide-react"

interface Portfolio {
  id: string
  userId: string
  sportType: string
  experience: string
  achievements: string
  awards: string
  bio: string
  goals: string
  createdAt: string
  updatedAt: string
}

export function AthletePortfolio({ userId }: { userId: string }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    sportType: "",
    experience: "",
    achievements: "",
    awards: "",
    bio: "",
    goals: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/athletes/${userId}/portfolio`)
        if (response.ok) {
          const data = await response.json()
          setPortfolio(data)
          setFormData({
            sportType: data.sportType || "",
            experience: data.experience || "",
            achievements: data.achievements || "",
            awards: data.awards || "",
            bio: data.bio || "",
            goals: data.goals || "",
          })
        } else if (response.status === 404) {
          // Portfolio not found, that's okay
          setPortfolio(null)
        } else {
          throw new Error("Failed to fetch portfolio")
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить портфолио",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [userId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = portfolio ? "PUT" : "POST"
      const url = portfolio ? `/api/athletes/${userId}/portfolio/${portfolio.id}` : `/api/athletes/${userId}/portfolio`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setPortfolio(data)
        setIsEditing(false)
        toast({
          title: "Успешно",
          description: "Портфолио сохранено",
        })
      } else {
        throw new Error("Failed to save portfolio")
      }
    } catch (error) {
      console.error("Error saving portfolio:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить портфолио",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Редактирование портфолио</h3>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sportType">Вид спорта</Label>
              <Input
                id="sportType"
                name="sportType"
                value={formData.sportType}
                onChange={handleChange}
                placeholder="Например: Футбол, Баскетбол, Плавание"
              />
            </div>
            <div>
              <Label htmlFor="experience">Опыт</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Например: 5 лет"
              />
            </div>
            <div>
              <Label htmlFor="achievements">Достижения</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Ваши основные достижения"
                rows={3}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="awards">Награды</Label>
              <Textarea
                id="awards"
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                placeholder="Полученные награды и медали"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Краткая информация о себе"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="goals">Цели</Label>
              <Textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Ваши спортивные цели"
                rows={3}
              />
            </div>
          </div>
        </div>
      </form>
    )
  }

  if (!portfolio) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">У вас пока нет портфолио</h3>
        <p className="text-muted-foreground mb-6">Создайте свое портфолио, чтобы рассказать о своих достижениях</p>
        <Button onClick={() => setIsEditing(true)}>Создать портфолио</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Портфолио спортсмена</h3>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Редактировать
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Спортивная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Вид спорта:</p>
              <p>{portfolio.sportType || "Не указано"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Опыт:</p>
              <p>{portfolio.experience || "Не указано"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="h-5 w-5 mr-2 text-yellow-500" />
              Достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{portfolio.achievements || "Достижения не указаны"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Награды
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{portfolio.awards || "Награды не указаны"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>О спортсмене</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Биография:</p>
              <p>{portfolio.bio || "Биография не указана"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Цели:</p>
              <p>{portfolio.goals || "Цели не указаны"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
