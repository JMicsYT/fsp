import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankingsFilters } from "@/components/rankings/rankings-filters"
import { RankingsTable } from "@/components/rankings/rankings-table"
import { RankingsStats } from "@/components/rankings/rankings-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function RankingsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Рейтинг</h1>
          <p className="text-muted-foreground">Рейтинг спортсменов и команд по видам спорта</p>
        </div>

        <Tabs defaultValue="athletes">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="athletes">Спортсмены</TabsTrigger>
            <TabsTrigger value="teams">Команды</TabsTrigger>
          </TabsList>
          <TabsContent value="athletes" className="space-y-6 mt-6">
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <RankingsFilters type="athletes" />
            </Suspense>
            <RankingsStats type="athletes" />
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <RankingsTable type="athletes" />
            </Suspense>
          </TabsContent>
          <TabsContent value="teams" className="space-y-6 mt-6">
            <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
              <RankingsFilters type="teams" />
            </Suspense>
            <RankingsStats type="teams" />
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <RankingsTable type="teams" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
