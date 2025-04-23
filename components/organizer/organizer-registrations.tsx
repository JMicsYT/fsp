"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Registration {
  id: string
  competitionId: string
  competitionTitle: string
  userId: string
  userName: string
  userEmail: string
  userImage: string | null
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  createdAt: string
}

export function OrganizerRegistrations({ userId }: { userId: string }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`/api/organizer/registrations?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setRegistrations(data)
        } else {
          throw new Error("Failed to fetch registrations")
        }
      } catch (error) {
        console.error("Error fetching registrations:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить заявки на участие",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRegistrations()
  }, [userId, toast])

  const handleStatusChange = async (registrationId: string, newStatus: "CONFIRMED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setRegistrations((prev) => prev.map((reg) => (reg.id === registrationId ? { ...reg, status: newStatus } : reg)))
        toast({
          title: "Успешно",
          description: `Заявка ${newStatus === "CONFIRMED" ? "подтверждена" : "отклонена"}`,
        })
      } else {
        throw new Error("Failed to update registration status")
      }
    } catch (error) {
      console.error("Error updating registration status:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заявки",
        variant: "destructive",
      })
    }
  }

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === "pending") return reg.status === "PENDING"
    if (activeTab === "confirmed") return reg.status === "CONFIRMED"
    if (activeTab === "rejected") return reg.status === "REJECTED" || reg.status === "CANCELLED"
    return true
  })

  const pendingCount = registrations.filter((reg) => reg.status === "PENDING").length
  const confirmedCount = registrations.filter((reg) => reg.status === "CONFIRMED").length
  const rejectedCount = registrations.filter((reg) => reg.status === "REJECTED" || reg.status === "CANCELLED").length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="border rounded-md">
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold mb-2">Нет заявок на участие</h3>
        <p className="text-muted-foreground">
          Когда участники начнут регистрироваться на ваши соревнования, заявки появятся здесь
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Ожидают подтверждения
            {pendingCount > 0 && (
              <Badge variant="default" className="ml-2 absolute top-0 right-0 -mt-1 -mr-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Подтвержденные
            {confirmedCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {confirmedCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Отклоненные
            {rejectedCount > 0 && (
              <Badge variant="outline" className="ml-2">
                {rejectedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Нет заявок в этой категории</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Участник</TableHead>
              <TableHead>Соревнование</TableHead>
              <TableHead>Статус оплаты</TableHead>
              <TableHead>Дата заявки</TableHead>
              {activeTab === "pending" && <TableHead className="text-right">Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={registration.userImage || undefined} alt={registration.userName} />
                      <AvatarFallback>{registration.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{registration.userName}</span>
                      <span className="text-xs text-muted-foreground">{registration.userEmail}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{registration.competitionTitle}</TableCell>
                <TableCell>
                  {registration.paymentStatus === "PAID" ? (
                    <Badge variant="default" className="bg-green-600">
                      Оплачено
                    </Badge>
                  ) : registration.paymentStatus === "PENDING" ? (
                    <Badge variant="outline">Ожидает оплаты</Badge>
                  ) : registration.paymentStatus === "FAILED" ? (
                    <Badge variant="destructive">Ошибка оплаты</Badge>
                  ) : (
                    <Badge variant="secondary">Возврат</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                {activeTab === "pending" && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleStatusChange(registration.id, "CONFIRMED")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Подтвердить
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleStatusChange(registration.id, "REJECTED")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Отклонить
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
