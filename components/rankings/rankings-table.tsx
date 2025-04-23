"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUp, ChevronDown, ChevronsUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RankingsTableProps {
  type: "athletes" | "teams"
}

// Тип для спортсмена
interface Athlete {
  id: number
  name: string
  avatar?: string
  discipline: string
  region: string
  points: number
  rank: number
  change: "up" | "down" | "same"
  changeValue: number
  achievements: {
    gold: number
    silver: number
    bronze: number
  }
}

// Тип для команды
interface Team {
  id: number
  name: string
  logo?: string
  discipline: string
  region: string
  points: number
  rank: number
  change: "up" | "down" | "same"
  changeValue: number
  achievements: {
    gold: number
    silver: number
    bronze: number
  }
  members: number
}

export function RankingsTable({ type }: RankingsTableProps) {
  const searchParams = useSearchParams()
  const [sortField, setSortField] = useState<string>("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filteredData, setFilteredData] = useState<Athlete[] | Team[]>([])

  // Демо-данные для спортсменов
  const athletes: Athlete[] = [
    {
      id: 1,
      name: "Иван Петров",
      avatar: "/avatars/01.png",
      discipline: "Футбол",
      region: "Москва",
      points: 1250,
      rank: 1,
      change: "same",
      changeValue: 0,
      achievements: { gold: 5, silver: 3, bronze: 2 },
    },
    {
      id: 2,
      name: "Анна Сидорова",
      avatar: "/avatars/02.png",
      discipline: "Волейбол",
      region: "Санкт-Петербург",
      points: 1180,
      rank: 2,
      change: "up",
      changeValue: 2,
      achievements: { gold: 4, silver: 5, bronze: 1 },
    },
    {
      id: 3,
      name: "Дмитрий Волков",
      avatar: "/avatars/03.png",
      discipline: "Баскетбол",
      region: "Новосибирск",
      points: 1120,
      rank: 3,
      change: "down",
      changeValue: 1,
      achievements: { gold: 3, silver: 4, bronze: 3 },
    },
    {
      id: 4,
      name: "Елена Смирнова",
      avatar: "/avatars/04.png",
      discipline: "Теннис",
      region: "Москва",
      points: 1050,
      rank: 4,
      change: "up",
      changeValue: 3,
      achievements: { gold: 2, silver: 6, bronze: 4 },
    },
    {
      id: 5,
      name: "Сергей Морозов",
      avatar: "/avatars/05.png",
      discipline: "Плавание",
      region: "Казань",
      points: 980,
      rank: 5,
      change: "down",
      changeValue: 2,
      achievements: { gold: 2, silver: 3, bronze: 5 },
    },
    {
      id: 6,
      name: "Ольга Новикова",
      avatar: "/avatars/06.png",
      discipline: "Лёгкая атлетика",
      region: "Екатеринбург",
      points: 920,
      rank: 6,
      change: "up",
      changeValue: 1,
      achievements: { gold: 1, silver: 4, bronze: 6 },
    },
    {
      id: 7,
      name: "Алексей Козлов",
      avatar: "/avatars/07.png",
      discipline: "Футбол",
      region: "Москва",
      points: 870,
      rank: 7,
      change: "same",
      changeValue: 0,
      achievements: { gold: 1, silver: 2, bronze: 4 },
    },
    {
      id: 8,
      name: "Мария Кузнецова",
      avatar: "/avatars/08.png",
      discipline: "Волейбол",
      region: "Санкт-Петербург",
      points: 820,
      rank: 8,
      change: "up",
      changeValue: 4,
      achievements: { gold: 0, silver: 3, bronze: 5 },
    },
    {
      id: 9,
      name: "Андрей Соколов",
      avatar: "/avatars/09.png",
      discipline: "Баскетбол",
      region: "Москва",
      points: 780,
      rank: 9,
      change: "down",
      changeValue: 3,
      achievements: { gold: 0, silver: 2, bronze: 4 },
    },
    {
      id: 10,
      name: "Екатерина Белова",
      avatar: "/avatars/10.png",
      discipline: "Теннис",
      region: "Новосибирск",
      points: 750,
      rank: 10,
      change: "up",
      changeValue: 2,
      achievements: { gold: 0, silver: 1, bronze: 3 },
    },
    {
      id: 11,
      name: "Михаил Иванов",
      avatar: "/avatars/11.png",
      discipline: "Шахматы",
      region: "Москва",
      points: 720,
      rank: 11,
      change: "down",
      changeValue: 1,
      achievements: { gold: 0, silver: 1, bronze: 2 },
    },
    {
      id: 12,
      name: "Наталья Попова",
      avatar: "/avatars/12.png",
      discipline: "Гимнастика",
      region: "Санкт-Петербург",
      points: 700,
      rank: 12,
      change: "up",
      changeValue: 3,
      achievements: { gold: 0, silver: 0, bronze: 3 },
    },
    {
      id: 13,
      name: "Владимир Соловьев",
      avatar: "/avatars/13.png",
      discipline: "Бокс",
      region: "Москва",
      points: 680,
      rank: 13,
      change: "same",
      changeValue: 0,
      achievements: { gold: 0, silver: 0, bronze: 2 },
    },
    {
      id: 14,
      name: "Татьяна Николаева",
      avatar: "/avatars/14.png",
      discipline: "Настольный теннис",
      region: "Екатеринбург",
      points: 650,
      rank: 14,
      change: "down",
      changeValue: 2,
      achievements: { gold: 0, silver: 0, bronze: 1 },
    },
    {
      id: 15,
      name: "Павел Смирнов",
      avatar: "/avatars/15.png",
      discipline: "Лыжные гонки",
      region: "Мурманская область",
      points: 630,
      rank: 15,
      change: "up",
      changeValue: 1,
      achievements: { gold: 0, silver: 0, bronze: 1 },
    },
  ]

  // Демо-данные для команд
  const teams: Team[] = [
    {
      id: 1,
      name: "Динамо",
      logo: "/logos/01.png",
      discipline: "Футбол",
      region: "Москва",
      points: 2500,
      rank: 1,
      change: "same",
      changeValue: 0,
      achievements: { gold: 8, silver: 5, bronze: 3 },
      members: 22,
    },
    {
      id: 2,
      name: "Зенит",
      logo: "/logos/02.png",
      discipline: "Футбол",
      region: "Санкт-Петербург",
      points: 2350,
      rank: 2,
      change: "up",
      changeValue: 1,
      achievements: { gold: 7, silver: 6, bronze: 4 },
      members: 21,
    },
    {
      id: 3,
      name: "ЦСКА",
      logo: "/logos/03.png",
      discipline: "Баскетбол",
      region: "Москва",
      points: 2200,
      rank: 3,
      change: "down",
      changeValue: 1,
      achievements: { gold: 6, silver: 7, bronze: 5 },
      members: 15,
    },
    {
      id: 4,
      name: "Локомотив",
      logo: "/logos/04.png",
      discipline: "Волейбол",
      region: "Новосибирск",
      points: 2050,
      rank: 4,
      change: "up",
      changeValue: 2,
      achievements: { gold: 5, silver: 8, bronze: 6 },
      members: 14,
    },
    {
      id: 5,
      name: "Спартак",
      logo: "/logos/05.png",
      discipline: "Футбол",
      region: "Москва",
      points: 1900,
      rank: 5,
      change: "down",
      changeValue: 2,
      achievements: { gold: 4, silver: 6, bronze: 8 },
      members: 23,
    },
    {
      id: 6,
      name: "Рубин",
      logo: "/logos/06.png",
      discipline: "Футбол",
      region: "Казань",
      points: 1750,
      rank: 6,
      change: "same",
      changeValue: 0,
      achievements: { gold: 3, silver: 5, bronze: 7 },
      members: 20,
    },
    {
      id: 7,
      name: "Химки",
      logo: "/logos/07.png",
      discipline: "Баскетбол",
      region: "Москва",
      points: 1600,
      rank: 7,
      change: "up",
      changeValue: 3,
      achievements: { gold: 2, silver: 4, bronze: 6 },
      members: 14,
    },
    {
      id: 8,
      name: "Динамо-Казань",
      logo: "/logos/08.png",
      discipline: "Волейбол",
      region: "Казань",
      points: 1450,
      rank: 8,
      change: "down",
      changeValue: 1,
      achievements: { gold: 2, silver: 3, bronze: 5 },
      members: 12,
    },
    {
      id: 9,
      name: "Урал",
      logo: "/logos/09.png",
      discipline: "Волейбол",
      region: "Екатеринбург",
      points: 1300,
      rank: 9,
      change: "up",
      changeValue: 2,
      achievements: { gold: 1, silver: 3, bronze: 4 },
      members: 13,
    },
    {
      id: 10,
      name: "Ростов",
      logo: "/logos/10.png",
      discipline: "Футбол",
      region: "Ростов-на-Дону",
      points: 1150,
      rank: 10,
      change: "same",
      changeValue: 0,
      achievements: { gold: 1, silver: 2, bronze: 3 },
      members: 21,
    },
    {
      id: 11,
      name: "Авангард",
      logo: "/logos/11.png",
      discipline: "Хоккей",
      region: "Омск",
      points: 1100,
      rank: 11,
      change: "up",
      changeValue: 1,
      achievements: { gold: 1, silver: 1, bronze: 3 },
      members: 25,
    },
    {
      id: 12,
      name: "Уфа",
      logo: "/logos/12.png",
      discipline: "Футбол",
      region: "Уфа",
      points: 1050,
      rank: 12,
      change: "down",
      changeValue: 2,
      achievements: { gold: 0, silver: 2, bronze: 3 },
      members: 22,
    },
    {
      id: 13,
      name: "Сибирь",
      logo: "/logos/13.png",
      discipline: "Хоккей",
      region: "Новосибирск",
      points: 1000,
      rank: 13,
      change: "same",
      changeValue: 0,
      achievements: { gold: 0, silver: 1, bronze: 4 },
      members: 24,
    },
    {
      id: 14,
      name: "Крылья Советов",
      logo: "/logos/14.png",
      discipline: "Футбол",
      region: "Самара",
      points: 950,
      rank: 14,
      change: "up",
      changeValue: 3,
      achievements: { gold: 0, silver: 1, bronze: 2 },
      members: 21,
    },
    {
      id: 15,
      name: "Енисей",
      logo: "/logos/15.png",
      discipline: "Баскетбол",
      region: "Красноярск",
      points: 900,
      rank: 15,
      change: "down",
      changeValue: 1,
      achievements: { gold: 0, silver: 0, bronze: 3 },
      members: 14,
    },
  ]

  // Apply filters and sorting
  useEffect(() => {
    const search = searchParams?.get("search") || ""
    const disciplineFilter = searchParams?.get("discipline") || ""
    const regionFilter = searchParams?.get("region") || ""

    // Get the correct data based on type
    const data = type === "athletes" ? athletes : teams

    // Apply filters
    let filtered = data.filter((item) => {
      const matchesSearch = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true
      const matchesDiscipline =
        disciplineFilter && disciplineFilter !== "all"
          ? item.discipline.toLowerCase().includes(disciplineFilter.toLowerCase())
          : true
      const matchesRegion =
        regionFilter && regionFilter !== "all" ? item.region.toLowerCase().includes(regionFilter.toLowerCase()) : true

      return matchesSearch && matchesDiscipline && matchesRegion
    })

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // For numeric values
      return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    setFilteredData(filtered)
  }, [searchParams, sortField, sortDirection, type])

  // Обработчик клика по заголовку таблицы
  const handleHeaderClick = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Получение иконки для сортировки
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Получение иконки для изменения рейтинга
  const getChangeIcon = (change: "up" | "down" | "same", value: number) => {
    if (change === "up") {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (change === "down") {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else {
      return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Отображение таблицы спортсменов
  const renderAthletesTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]" onClick={() => handleHeaderClick("rank")}>
              <div className="flex items-center gap-1 cursor-pointer">Место {getSortIcon("rank")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("name")}>
              <div className="flex items-center gap-1 cursor-pointer">Спортсмен {getSortIcon("name")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("discipline")}>
              <div className="flex items-center gap-1 cursor-pointer">Вид спорта {getSortIcon("discipline")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("region")}>
              <div className="flex items-center gap-1 cursor-pointer">Регион {getSortIcon("region")}</div>
            </TableHead>
            <TableHead className="text-right" onClick={() => handleHeaderClick("points")}>
              <div className="flex items-center justify-end gap-1 cursor-pointer">Очки {getSortIcon("points")}</div>
            </TableHead>
            <TableHead className="text-center">Медали</TableHead>
            <TableHead className="text-center">Изменение</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(filteredData as Athlete[]).length > 0 ? (
            (filteredData as Athlete[]).map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell className="font-medium text-center">{athlete.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={athlete.avatar || "/placeholder.svg?height=32&width=32"} alt={athlete.name} />
                      <AvatarFallback>{athlete.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{athlete.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{athlete.discipline}</Badge>
                </TableCell>
                <TableCell>{athlete.region}</TableCell>
                <TableCell className="text-right font-medium">{athlete.points}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                      {athlete.achievements.gold}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                      {athlete.achievements.silver}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-700 text-white hover:bg-amber-800">
                      {athlete.achievements.bronze}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-1">
                    {getChangeIcon(athlete.change, athlete.changeValue)}
                    <span
                      className={
                        athlete.change === "up" ? "text-green-500" : athlete.change === "down" ? "text-red-500" : ""
                      }
                    >
                      {athlete.changeValue > 0 ? athlete.changeValue : "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/athletes/${athlete.id}`}>
                    <Button variant="ghost" size="sm">
                      Профиль
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                <div className="text-muted-foreground">Спортсмены не найдены</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }

  // Отображение таблицы команд
  const renderTeamsTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]" onClick={() => handleHeaderClick("rank")}>
              <div className="flex items-center gap-1 cursor-pointer">Место {getSortIcon("rank")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("name")}>
              <div className="flex items-center gap-1 cursor-pointer">Команда {getSortIcon("name")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("discipline")}>
              <div className="flex items-center gap-1 cursor-pointer">Вид спорта {getSortIcon("discipline")}</div>
            </TableHead>
            <TableHead onClick={() => handleHeaderClick("region")}>
              <div className="flex items-center gap-1 cursor-pointer">Регион {getSortIcon("region")}</div>
            </TableHead>
            <TableHead className="text-center" onClick={() => handleHeaderClick("members")}>
              <div className="flex items-center justify-center gap-1 cursor-pointer">
                Состав {getSortIcon("members")}
              </div>
            </TableHead>
            <TableHead className="text-right" onClick={() => handleHeaderClick("points")}>
              <div className="flex items-center justify-end gap-1 cursor-pointer">Очки {getSortIcon("points")}</div>
            </TableHead>
            <TableHead className="text-center">Медали</TableHead>
            <TableHead className="text-center">Изменение</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(filteredData as Team[]).length > 0 ? (
            (filteredData as Team[]).map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium text-center">{team.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={team.logo || "/placeholder.svg?height=32&width=32"} alt={team.name} />
                      <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{team.discipline}</Badge>
                </TableCell>
                <TableCell>{team.region}</TableCell>
                <TableCell className="text-center">{team.members}</TableCell>
                <TableCell className="text-right font-medium">{team.points}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                      {team.achievements.gold}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                    >
                      {team.achievements.silver}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-700 text-white hover:bg-amber-800">
                      {team.achievements.bronze}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-1">
                    {getChangeIcon(team.change, team.changeValue)}
                    <span
                      className={team.change === "up" ? "text-green-500" : team.change === "down" ? "text-red-500" : ""}
                    >
                      {team.changeValue > 0 ? team.changeValue : "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/teams/${team.id}`}>
                    <Button variant="ghost" size="sm">
                      Профиль
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6">
                <div className="text-muted-foreground">Команды не найдены</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="rounded-lg border bg-card">{type === "athletes" ? renderAthletesTable() : renderTeamsTable()}</div>
  )
}
