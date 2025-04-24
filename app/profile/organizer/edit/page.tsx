"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function EditOrganizerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    organization: "",
    phone: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated") return

    const userId = session.user.id
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name ?? "",
          region: data.region ?? "",
          organization: data.organization ?? "",
          phone: data.phone ?? "",
        })
      })
      .catch(() => {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные профиля",
          variant: "destructive",
        })
      })
      .finally(() => setLoading(false))
  }, [session, status, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = session.user.id
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Успех", description: "Профиль обновлён" })
      router.push("/profile/organizer")
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  return (
    <div className="container mx-auto py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Редактирование профиля организатора</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Название/Имя</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Регион</Label>
          <Input
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="organization">Организация</Label>
          <Input
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </div>
  )
}
