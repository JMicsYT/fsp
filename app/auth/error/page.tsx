"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    if (!error) {
      router.push("/auth/login")
    }
  }, [error, router])

  const getErrorMessage = () => {
    switch (error) {
      case "CredentialsSignin":
        return "Неверный email или пароль."
      case "SessionRequired":
        return "Для доступа к этой странице необходимо войти в систему."
      case "AccessDenied":
        return "У вас нет доступа к этой странице."
      case "CallbackRouteError":
        return "Произошла ошибка при обработке запроса аутентификации."
      case "OAuthAccountNotLinked":
        return "Для входа с этой учетной записью необходимо сначала войти с помощью email и пароля."
      case "OAuthSignInError":
        return "Произошла ошибка при входе через внешний сервис."
      case "OAuthCallbackError":
        return "Произошла ошибка при обработке ответа от внешнего сервиса."
      case "EmailSignInError":
        return "Произошла ошибка при отправке ссылки для входа на ваш email."
      case "EmailCreateError":
        return "Произошла ошибка при создании учетной записи с этим email."
      case "Default":
      default:
        return "Произошла неизвестная ошибка при аутентификации."
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-2xl font-bold tracking-tight">Ошибка аутентификации</CardTitle>
          </div>
          <CardDescription>Произошла ошибка при попытке входа в систему</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="mb-4">{getErrorMessage()}</p>
            <p className="text-sm text-muted-foreground">
              Пожалуйста, попробуйте снова или обратитесь в службу поддержки, если проблема не устраняется.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Вернуться на страницу входа</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">На главную</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
