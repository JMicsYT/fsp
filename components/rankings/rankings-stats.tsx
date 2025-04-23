import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Star, TrendingUp } from "lucide-react"

interface RankingsStatsProps {
  type: "athletes" | "teams"
}

export function RankingsStats({ type }: RankingsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {type === "athletes" ? "Спортсменов в рейтинге" : "Команд в рейтинге"}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{type === "athletes" ? "5,240" : "842"}</div>
          <p className="text-xs text-muted-foreground">Из всех регионов России</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Видов спорта</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">20+</div>
          <p className="text-xs text-muted-foreground">Олимпийские и неолимпийские</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Соревнований учтено</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">450+</div>
          <p className="text-xs text-muted-foreground">За последний год</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Обновление рейтинга</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Еженедельно</div>
          <p className="text-xs text-muted-foreground">Каждый понедельник</p>
        </CardContent>
      </Card>
    </div>
  )
}
