import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

export function AdminUsers() {
  // В реальном приложении данные будут загружаться из API
  const users = [
    {
      id: 101,
      name: "Иван Петров",
      email: "ivan@example.com",
      role: "Спортсмен",
      region: "Москва",
      registrationDate: "2022-05-15",
      status: "Активен",
    },
    {
      id: 102,
      name: "Анна Сидорова",
      email: "anna@example.com",
      role: "Спортсмен",
      region: "Санкт-Петербург",
      registrationDate: "2022-06-20",
      status: "Активен",
    },
    {
      id: 201,
      name: "Елена Смирнова",
      email: "elena@example.com",
      role: "Капитан команды",
      region: "Москва",
      registrationDate: "2022-04-10",
      status: "Активен",
    },
    {
      id: 301,
      name: "Дмитрий Волков",
      email: "dmitry@example.com",
      role: "Представитель региона",
      region: "Новосибирск",
      registrationDate: "2022-03-05",
      status: "Активен",
    },
    {
      id: 401,
      name: "Сергей Морозов",
      email: "sergey@example.com",
      role: "Представитель федерации",
      region: "Москва",
      registrationDate: "2022-02-15",
      status: "Активен",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Поиск пользователей..." className="pl-8" />
        </div>
        <Button>Добавить пользователя</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Регион</TableHead>
            <TableHead>Дата регистрации</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>{user.region}</TableCell>
              <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={user.status === "Активен" ? "default" : "secondary"}>{user.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                  <Button variant="ghost" size="sm">
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm">
                    Блокировать
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
