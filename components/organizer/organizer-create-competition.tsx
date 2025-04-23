"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

interface OrganizerCreateCompetitionProps {
  userId: string
  onSuccess: () => void
}

export function OrganizerCreateCompetition({ userId, onSuccess }: OrganizerCreateCompetitionProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [registrationPeriod, setRegistrationPeriod] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  })
  const [eventStart, setEventStart] = useState<Date | undefined>(addDays(new Date(), 31))
  const [eventEnd, setEventEnd] = useState<Date | undefined>(addDays(new Date(), 33))

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    discipline: "",
    region: "",
    description: "",
    rules: "",
    prizes: "",
    maxParticipants: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registrationPeriod?.from || !registrationPeriod?.to || !eventStart || !eventEnd) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите все даты",
        variant: "destructive",
      })
      return
    }

    if (!formData.title || !formData.type || !formData.discipline || !formData.region) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/competitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizerId: userId,
          registrationStart: registrationPeriod.from,
          registrationEnd: registrationPeriod.to,
          eventStart,
          eventEnd,
          maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : null,
          status: "REGISTRATION_OPEN",
        }),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Соревнование создано",
        })
        onSuccess()
      } else {
        throw new Error("Failed to create competition")
      }
    } catch (error) {
      console.error("Error creating competition:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать соревнование",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "general") setActiveTab("dates")
    else if (activeTab === "dates") setActiveTab("details")
  }

  const prevTab = () => {
    if (activeTab === "details") setActiveTab("dates")
    else if (activeTab === "dates") setActiveTab("general")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Создание соревнования</CardTitle>
          <CardDescription>Заполните информацию о новом соревновании</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Общая информация</TabsTrigger>
              <TabsTrigger value="dates">Даты и ограничения</TabsTrigger>
              <TabsTrigger value="details">Детали и правила</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название соревнования *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Введите название соревнования"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Тип соревнования *</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Выберите тип соревнования" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Открытое</SelectItem>
                    <SelectItem value="REGIONAL">Региональное</SelectItem>
                    <SelectItem value="FEDERAL">Федеральное</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discipline">Вид спорта *</Label>
                <Select value={formData.discipline} onValueChange={(value) => handleSelectChange("discipline", value)}>
                  <SelectTrigger id="discipline">
                    <SelectValue placeholder="Выберите вид спорта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Футбол">Футбол</SelectItem>
                    <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                    <SelectItem value="Волейбол">Волейбол</SelectItem>
                    <SelectItem value="Теннис">Теннис</SelectItem>
                    <SelectItem value="Плавание">Плавание</SelectItem>
                    <SelectItem value="Лёгкая атлетика">Лёгкая атлетика</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Регион *</Label>
                <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Выберите регион" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Вся Россия">Вся Россия</SelectItem>
                    <SelectItem value="Москва">Москва</SelectItem>
                    <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                    <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                    <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                    <SelectItem value="Казань">Казань</SelectItem>
                    <SelectItem value="Без ограничений">Без ограничений</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="dates" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Период регистрации *</Label>
                <DatePickerWithRange date={registrationPeriod} setDate={setRegistrationPeriod} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Дата начала соревнования *</Label>
                  <DatePicker date={eventStart} setDate={setEventStart} />
                </div>
                <div className="space-y-2">
                  <Label>Дата окончания соревнования *</Label>
                  <DatePicker date={eventEnd} setDate={setEventEnd} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Максимальное количество участников</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  placeholder="Оставьте пустым для неограниченного количества"
                />
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="description">Описание соревнования *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Введите описание соревнования"
                  rows={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rules">Правила соревнования *</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Введите правила соревнования"
                  rows={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prizes">Призы и награды</Label>
                <Textarea
                  id="prizes"
                  name="prizes"
                  value={formData.prizes}
                  onChange={handleInputChange}
                  placeholder="Опишите призы и награды"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {activeTab !== "general" ? (
            <Button type="button" variant="outline" onClick={prevTab}>
              Назад
            </Button>
          ) : (
            <div></div>
          )}
          {activeTab !== "details" ? (
            <Button type="button" onClick={nextTab}>
              Далее
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать соревнование"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}
