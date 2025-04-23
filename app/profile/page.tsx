"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Mail, Phone } from "lucide-react"
import { ProfileCompetitions } from "@/components/profile/profile-competitions"
import { ProfileTeams } from "@/components/profile/profile-teams"
import { ProfileAchievements } from "@/components/profile/profile-achievements"
import { ProfileRegistrations } from "@/components/profile/profile-registrations"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login?callbackUrl=/profile")
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id)
    }
  }, [status, session])

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      } else {
        throw new Error("Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные пользователя",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-1/3">
              <CardHeader className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
                <div className="h-6 w-32 mt-4 bg-muted animate-pulse" />
                <div className="h-4 w-20 mt-2 bg-muted animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-4 w-4 mr-2 bg-muted animate-pulse" />
                      <div className="h-4 w-full bg-muted animate-pulse" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="w-full md:w-2/3">
              <div className="h-10 w-full bg-muted animate-pulse" />
              <div className="h-[400px] mt-6 w-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Use session data if userData is not available yet
  const user = userData || {
    id: session?.user?.id,
    name: session?.user?.name,
    email: session?.user?.email,
    role: session?.user?.role,
    region: "",
    organization: "",
    phone: "",
    registrationDate: new Date().toISOString(),
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-1/3">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || "/placeholder.svg?height=96&width=96"} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>
                <Badge variant="outline">{user.role === "ATHLETE" ? "Спортсмен" : "Организатор"}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.region && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.region}</span>
                  </div>
                )}
                {user.organization && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.organization}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Регистрация: {new Date(user.createdAt || user.registrationDate).toLocaleDateString()}</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Редактировать профиль
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="competitions">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="competitions">Соревнования</TabsTrigger>
                <TabsTrigger value="teams">Команды</TabsTrigger>
                <TabsTrigger value="registrations">Регистрации</TabsTrigger>
                <TabsTrigger value="achievements">Достижения</TabsTrigger>
              </TabsList>
              <TabsContent value="competitions" className="mt-6">
                <ProfileCompetitions userId={user.id} userRole={user.role} />
              </TabsContent>
              <TabsContent value="teams" className="mt-6">
                <ProfileTeams userId={user.id} />
              </TabsContent>
              <TabsContent value="registrations" className="mt-6">
                <ProfileRegistrations userId={user.id} />
              </TabsContent>
              <TabsContent value="achievements" className="mt-6">
                <ProfileAchievements userId={user.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
