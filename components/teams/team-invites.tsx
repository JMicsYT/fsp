import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TeamInvitesProps {
  teamId: number
  invites: Array<{
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

export function TeamInvites({ teamId, invites, isCurrentUserCaptain }: TeamInvitesProps) {
  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">Нет активных приглашений</p>
        {isCurrentUserCaptain && <Button className="mt-4">Пригласить участника</Button>}
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
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={invite.user.avatar || "/placeholder.svg"} alt={invite.user.name} />
                    <AvatarFallback>{invite.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{invite.user.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    invite.status === "Принято" ? "default" : invite.status === "Отклонено" ? "destructive" : "outline"
                  }
                >
                  {invite.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(invite.date).toLocaleDateString()}</TableCell>
              {isCurrentUserCaptain && (
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Отменить
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isCurrentUserCaptain && (
        <div className="flex justify-end">
          <Button>Пригласить участника</Button>
        </div>
      )}
    </div>
  )
}
