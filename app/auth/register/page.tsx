"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import bcrypt from "bcryptjs"

// List of Russian regions
const russianRegions = [
  "Москва",
  "Санкт-Петербург",
  "Республика Адыгея",
  "Республика Алтай",
  "Республика Башкортостан",
  "Республика Бурятия",
  "Республика Дагестан",
  "Республика Ингушетия",
  "Кабардино-Балкарская Республика",
  "Республика Калмыкия",
  "Карачаево-Черкесская Республика",
  "Республика Карелия",
  "Республика Коми",
  "Республика Крым",
  "Республика Марий Эл",
  "Республика Мордовия",
  "Республика Саха (Якутия)",
  "Республика Северная Осетия — Алания",
  "Республика Татарстан",
  "Республика Тыва",
  "Удмуртская Республика",
  "Республика Хакасия",
  "Чеченская Республика",
  "Чувашская Республика",
  "Алтайский край",
  "Забайкальский край",
  "Камчатский край",
  "Краснодарский край",
  "Красноярский край",
  "Пермский край",
  "Приморский край",
  "Ставропольский край",
  "Хабаровский край",
  "Амурская область",
  "Архангельская область",
  "Астраханская область",
  "Белгородская область",
  "Брянская область",
  "Владимирская область",
  "Волгоградская область",
  "Вологодская область",
  "Воронежская область",
  "Ивановская область",
  "Иркутская область",
  "Калининградская область",
  "Калужская область",
  "Кемеровская область",
  "Кировская область",
  "Костромская область",
  "Курганская область",
  "Курская область",
  "Ленинградская область",
  "Липецкая область",
  "Магаданская область",
  "Московская область",
  "Мурманская область",
  "Нижегородская область",
  "Новгородская область",
  "Новосибирская область",
  "Омская область",
  "Оренбургская область",
  "Орловская область",
  "Пензенская область",
  "Псковская область",
  "Ростовская область",
  "Рязанская область",
  "Самарская область",
  "Саратовская область",
  "Сахалинская область",
  "Свердловская область",
  "Смоленская область",
  "Тамбовская область",
  "Тверская область",
  "Томская область",
  "Тульская область",
  "Тюменская область",
  "Ульяновская область",
  "Челябинская область",
  "Ярославская область",
  "Севастополь",
  "Еврейская автономная область",
  "Ненецкий автономный округ",
  "Ханты-Мансийский автономный округ — Югра",
  "Чукотский автономный округ",
  "Ямало-Ненецкий автономный округ",
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ATHLETE", // Default role
    region: "",
    organization: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10)

      // Create user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          password: hashedPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = "Не удалось зарегистрироваться"

        try {
          const jsonError = JSON.parse(errorData)
          errorMessage = jsonError.error || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", errorData)
        }

        throw new Error(errorMessage)
      }

      toast({
        title: "Успешно",
        description: "Регистрация прошла успешно. Теперь вы можете войти в систему.",
      })
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Error registering:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось зарегистрироваться",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для участия в соревнованиях</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                name="name"
                placeholder="Введите ваше полное имя"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Введите ваш email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATHLETE">Спортсмен</SelectItem>
                  <SelectItem value="ORGANIZER">Организатор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Регион</Label>
              <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {russianRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Организация</Label>
              <Input
                id="organization"
                name="organization"
                placeholder="Введите вашу организацию"
                value={formData.organization}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Введите ваш телефон"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                Войти
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
