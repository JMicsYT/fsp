"use client"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <CardTitle className="text-2xl font-bold tracking-tight">Выход из системы</CardTitle>
          </div>
          <CardDescription>Вы уверены, что хотите выйти из системы?</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            После выхода вам потребуется снова войти в систему для доступа к вашему аккаунту.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleLogout} className="w-full">
            Выйти
          </Button>
          <Button variant="outline" onClick={handleCancel} className="w-full">
            Отмена
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
