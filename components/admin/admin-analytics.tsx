import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, BarChart, PieChart, LineChart, Users, Trophy, Calendar } from "lucide-react"

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select defaultValue="year">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Последний месяц</SelectItem>
              <SelectItem value="quarter">Последний квартал</SelectItem>
              <SelectItem value="year">Последний год</SelectItem>
              <SelectItem value="all">Все время</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Регион" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все регионы</SelectItem>
              <SelectItem value="moscow">Москва</SelectItem>
              <SelectItem value="spb">Санкт-Петербург</SelectItem>
              <SelectItem value="novosibirsk">Новосибирск</SelectItem>
              <SelectItem value="ekaterinburg">Екатеринбург</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Выгрузить данные
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего соревнований</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">+15% по сравнению с прошлым годом</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">+32% по сравнению с прошлым годом</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Команд</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">+25% по сравнению с прошлым годом</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Регионов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">+8 новых регионов</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="competitions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competitions">Соревнования</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="regions">Регионы</TabsTrigger>
        </TabsList>
        <TabsContent value="competitions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика соревнований</CardTitle>
              <CardDescription>Распределение соревнований по типам и времени</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <BarChart className="h-10 w-10" />
                  <p>График статистики соревнований</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика пользователей</CardTitle>
              <CardDescription>Активность и рост числа пользователей</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <LineChart className="h-10 w-10" />
                  <p>График статистики пользователей</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="regions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика по регионам</CardTitle>
              <CardDescription>Распределение активности по регионам</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <PieChart className="h-10 w-10" />
                  <p>График статистики по регионам</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
