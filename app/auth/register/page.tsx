"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const russianRegions = ["Москва", "Санкт-Петербург", "Татарстан", "Башкортостан"]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ATHLETE",
    region: "",
    organization: "",
    phone: ""
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
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        region: formData.region,
        organization: formData.organization,
        phone: formData.phone
      })

      toast({
        title: "Успешно",
        description: "Регистрация прошла успешно!",
      })

      router.push("/auth/login")
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error?.response?.data?.error || "Что-то пошло не так",
        variant: "destructive"
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
          <CardDescription>Создайте аккаунт</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Повторите пароль</Label>
              <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label>Роль</Label>
              <Select value={formData.role} onValueChange={(val) => handleSelectChange("role", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATHLETE">Спортсмен</SelectItem>
                  <SelectItem value="ORGANIZER">Организатор</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Регион</Label>
              <Select value={formData.region} onValueChange={(val) => handleSelectChange("region", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {russianRegions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Организация</Label>
              <Input name="organization" value={formData.organization} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
            <p className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary underline">Войти</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
