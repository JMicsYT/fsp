"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"

interface RankingsFiltersProps {
  type: "athletes" | "teams"
}

export function RankingsFilters({ type }: RankingsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [discipline, setDiscipline] = useState(searchParams?.get("discipline") || "")
  const [region, setRegion] = useState(searchParams?.get("region") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (discipline) params.set("discipline", discipline)
    if (region) params.set("region", region)

    router.push(`/rankings?${params.toString()}`)
  }

  const resetFilters = () => {
    setDiscipline("")
    setRegion("")
    setSearchQuery("")
    router.push("/rankings")
  }

  // Apply filters when button is clicked
  const applyFilters = () => {
    updateFilters()
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Фильтры рейтинга</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Поиск ${type === "athletes" ? "спортсменов" : "команд"}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={discipline} onValueChange={setDiscipline}>
          <SelectTrigger>
            <SelectValue placeholder="Вид спорта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все виды спорта</SelectItem>
            <SelectItem value="football">Футбол</SelectItem>
            <SelectItem value="basketball">Баскетбол</SelectItem>
            <SelectItem value="volleyball">Волейбол</SelectItem>
            <SelectItem value="tennis">Теннис</SelectItem>
            <SelectItem value="swimming">Плавание</SelectItem>
            <SelectItem value="athletics">Лёгкая атлетика</SelectItem>
            <SelectItem value="chess">Шахматы</SelectItem>
            <SelectItem value="boxing">Бокс</SelectItem>
            <SelectItem value="badminton">Бадминтон</SelectItem>
            <SelectItem value="table-tennis">Настольный теннис</SelectItem>
            <SelectItem value="skiing">Лыжные гонки</SelectItem>
            <SelectItem value="gymnastics">Гимнастика</SelectItem>
          </SelectContent>
        </Select>

        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger>
            <SelectValue placeholder="Регион" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все регионы</SelectItem>
            <SelectItem value="moscow">Москва</SelectItem>
            <SelectItem value="spb">Санкт-Петербург</SelectItem>
            <SelectItem value="novosibirsk">Новосибирск</SelectItem>
            <SelectItem value="ekaterinburg">Екатеринбург</SelectItem>
            <SelectItem value="kazan">Казань</SelectItem>
            <SelectItem value="sochi">Сочи</SelectItem>
            <SelectItem value="murmansk">Мурманская область</SelectItem>
            <SelectItem value="rostov">Ростов-на-Дону</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={resetFilters}>
          <X className="h-4 w-4" /> Сбросить
        </Button>
        <Button size="sm" onClick={applyFilters}>
          Применить фильтры
        </Button>
      </div>
    </div>
  )
}
