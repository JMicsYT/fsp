"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface RegistrationFormProps {
  competition: {
    id: string
    title: string
    type: string
    discipline: string
    organizer: {
      id: string
      name: string
      email: string
    }
  }
}

export function RegistrationForm({ competition }: RegistrationFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    comment: "",
    agreeToTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с правилами соревнования",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competitionId: competition.id,
          userId: session?.user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          comment: formData.comment,
        }),
      })

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Ваша заявка на участие отправлена",
        })
        router.push(`/competitions/${competition.id}?registered=true`)
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to register")
      }
    } catch (error: any) {
      console.error("Error registering:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить заявку на участие",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Регистрация на соревнование</CardTitle>
        <CardDescription>Заполните форму для регистрации на соревнование "{competition.title}"</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ФИО *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите ваше полное имя"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите ваш email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Дополнительная информация (необязательно)"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              required
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              Я согласен с{" "}
              <Link href="/terms" className="text-primary hover:underline">
                правилами соревнования
              </Link>{" "}
              и{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
