// app/profile/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ProfileEntryPage() {
  // 1) Получаем серверную сессию
  const session = await getServerSession(authOptions)
  if (!session) {
    // Если не залогинены — отправляем на логин
    redirect("/auth/login?callbackUrl=/profile")
  }

  // 2) Извлекаем роль пользователя
  const role = session.user.role as string | undefined

  // 3) Редиректим на соответствующую страницу
  switch (role) {
    case "ATHLETE":
      redirect("/profile/athlete")
    case "ORGANIZER":
      redirect("/profile/organizer")
    case "ADMIN":
      redirect("/profile/admin")
    default:
      // На всякий случай — по умолчанию в профайл спортсмена
      redirect("/profile/athlete")
  }
}
