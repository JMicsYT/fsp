"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

export default function CreateCompetitionClientPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    discipline: "",
    region: "",
    registrationStart: new Date(),
    registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
    eventStart: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // +14 days
    eventEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 days
    maxParticipants: "",
    teamSize: "3",
    description: "",
    rules: "",
    prizes: "",
    contacts: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему как организатор",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!formData.title || !formData.type || !formData.discipline || !formData.region) {
      setActiveTab("general")
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля в разделе 'Общая информация'",
        variant: "destructive",
      })
      return
    }

    if (!formData.description || !formData.rules) {
      setActiveTab("details")
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля в разделе 'Детали и правила'",
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
          maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : null,
          organizerId: session.user.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Успешно",
          description: "Соревнование успешно создано",
        })
        router.push(`/competitions/${data.id}`)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create competition")
      }
    } catch (error: any) {
      console.error("Error creating competition:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать соревнование",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Создание соревнования</h1>
          <p className="text-muted-foreground">Заполните форму для создания нового соревнования</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Информация о соревновании</CardTitle>
            <CardDescription>Заполните все обязательные поля для создания соревнования</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
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
                  <Label htmlFor="discipline">Дисциплина *</Label>
                  <Select
                    value={formData.discipline}
                    onValueChange={(value) => handleSelectChange("discipline", value)}
                  >
                    <SelectTrigger id="discipline">
                      <SelectValue placeholder="Выберите дисциплину" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Алгоритмическое программирование">Алгоритмическое программирование</SelectItem>
                      <SelectItem value="Веб-разработка">Веб-разработка</SelectItem>
                      <SelectItem value="Мобильная разработка">Мобильная разработка</SelectItem>
                      <SelectItem value="Искусственный интеллект">Искусственный интеллект</SelectItem>
                      <SelectItem value="Командное программирование">Командное программирование</SelectItem>
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
                      <SelectItem value="Другой регион">Другой регион</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="dates" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата начала регистрации *</Label>
                    <DatePickerDemo
                      date={formData.registrationStart}
                      onSelect={(date) => handleDateChange("registrationStart", date)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Дата окончания регистрации *</Label>
                    <DatePickerDemo
                      date={formData.registrationEnd}
                      onSelect={(date) => handleDateChange("registrationEnd", date)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата начала соревнования *</Label>
                    <DatePickerDemo
                      date={formData.eventStart}
                      onSelect={(date) => handleDateChange("eventStart", date)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Дата окончания соревнования *</Label>
                    <DatePickerDemo date={formData.eventEnd} onSelect={(date) => handleDateChange("eventEnd", date)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Максимальное количество участников</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="Введите максимальное количество участников"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Размер команды</Label>
                  <Input
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="Введите размер команды"
                    defaultValue="3"
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
                <div className="space-y-2">
                  <Label htmlFor="contacts">Контактная информация организаторов *</Label>
                  <Textarea
                    id="contacts"
                    name="contacts"
                    value={formData.contacts}
                    onChange={handleInputChange}
                    placeholder="Введите контактную информацию"
                    rows={2}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Создание..." : "Создать соревнование"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function DatePickerDemo({ date, onSelect }: { date?: Date; onSelect?: (date: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
