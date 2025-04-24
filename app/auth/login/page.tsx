"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })

    if (result?.error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      })
    } else {
      try {
        const res = await fetch("/api/auth/session")
        const session = await res.json()
        const role = session?.user?.role

        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        })

        if (role === "ATHLETE") router.push("/profile/athlete")
        else if (role === "ORGANIZER") router.push("/profile/organizer")
        else if (role === "ADMIN") router.push("/profile/admin")
        else router.push("/profile")
      } catch (e) {
        router.push("/profile")
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Вход в систему</CardTitle>
          <CardDescription>Введите свои учетные данные</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
            <p className="text-sm text-center">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-primary underline">
                Зарегистрироваться
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
