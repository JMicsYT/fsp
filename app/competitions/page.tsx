import type { Metadata } from "next"
import { Suspense } from "react"
import { CompetitionFilters } from "@/components/competitions/competition-filters"
import { CompetitionsList } from "@/components/competitions/competitions-list"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Соревнования | СЦР",
  description: "Просмотр и поиск спортивных соревнований",
}

export default function CompetitionsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Соревнования</h1>
          <p className="text-muted-foreground">Найдите и зарегистрируйтесь на спортивные соревнования</p>
        </div>
        <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
          <CompetitionFilters />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
          <CompetitionsList />
        </Suspense>
      </div>
    </div>
  )
}
