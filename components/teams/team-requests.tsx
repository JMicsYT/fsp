import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TeamRequestsProps {
  teamId: number
  requests: Array<{
    id: number
    user: {
      id: number
      name: string
      avatar: string
    }
    status: string
    date: string
  }>
  isCurrentUserCaptain: boolean
}

export function TeamRequests({ teamId, requests, isCurrentUserCaptain }: TeamRequestsProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">Нет заявок на вступление в команду</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата</TableHead>
            {isCurrentUserCaptain && <TableHead className="text-right">Действия</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                    <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{request.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "Принято"
                      ? "default"
                      : request.status === "Отклонено"
                        ? "destructive"
                        : "outline"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
              {isCurrentUserCaptain && request.status === "Ожидает ответа" && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="default" size="sm">
                      Принять
                    </Button>
                    <Button variant="outline" size="sm">
                      Отклонить
                    </Button>
                  </div>
                </TableCell>
              )}
              {isCurrentUserCaptain && request.status !== "Ожидает ответа" && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    Обработано
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
