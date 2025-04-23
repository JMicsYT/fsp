import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RegistrationForm } from "@/components/competitions/registration-form"
import prisma from "@/lib/db"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
  })

  if (!competition) {
    return {
      title: "Соревнование не найдено | СЦР",
    }
  }

  return {
    title: `Регистрация на ${competition.title} | СЦР`,
    description: `Зарегистрируйтесь на соревнование ${competition.title}`,
  }
}

export default async function RegisterPage({ params }: PageProps) {
  const competition = await prisma.competition.findUnique({
    where: { id: params.id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!competition) {
    notFound()
  }

  // Проверяем, открыта ли регистрация
  const now = new Date()
  const registrationStart = new Date(competition.registrationStart)
  const registrationEnd = new Date(competition.registrationEnd)

  const isRegistrationOpen =
    now >= registrationStart && now <= registrationEnd && competition.status === "REGISTRATION_OPEN"

  // Проверяем, достигнуто ли максимальное количество участников
  const isFullyBooked =
    competition.maxParticipants !== null && competition.currentParticipants >= competition.maxParticipants

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Регистрация на соревнование</h1>
          <p className="text-muted-foreground">{competition.title}</p>
        </div>

        {!isRegistrationOpen ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">��егистрация закрыта</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Регистрация на это соревнование {now < registrationStart ? "еще не началась" : "уже завершена"}.
            </p>
            <p className="text-yellow-600 dark:text-yellow-200 mt-2">
              Период регистрации: {registrationStart.toLocaleDateString()} - {registrationEnd.toLocaleDateString()}
            </p>
          </div>
        ) : isFullyBooked ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">Регистрация закрыта</h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Достигнуто максимальное количество участников ({competition.maxParticipants}).
            </p>
          </div>
        ) : (
          <RegistrationForm competition={competition} />
        )}
      </div>
    </div>
  )
}
