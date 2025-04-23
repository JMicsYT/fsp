"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Search, Filter, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"

// Типы для фильтров
interface FilterState {
  search: string
  type: {
    open: boolean
    regional: boolean
    federal: boolean
  }
  discipline: string
  dateRange: DateRange | undefined
  region: string
  status: {
    openReg: boolean
    upcoming: boolean
    completed: boolean
  }
}

export function CompetitionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)

  // Initialize filters from URL params
  const initializeFilters = () => {
    const search = searchParams.get("search") || ""
    const types = searchParams.getAll("type")
    const discipline = searchParams.get("discipline") || ""
    const region = searchParams.get("region") || ""
    const statuses = searchParams.getAll("status")

    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")

    let dateRange: DateRange | undefined = undefined
    if (fromDate || toDate) {
      dateRange = {
        from: fromDate ? new Date(fromDate) : undefined,
        to: toDate ? new Date(toDate) : undefined,
      }
    }

    return {
      search,
      type: {
        open: types.includes("OPEN"),
        regional: types.includes("REGIONAL"),
        federal: types.includes("FEDERAL"),
      },
      discipline,
      dateRange,
      region,
      status: {
        openReg: statuses.includes("REGISTRATION_OPEN"),
        upcoming: statuses.includes("IN_PROGRESS"),
        completed: statuses.includes("COMPLETED"),
      },
    }
  }

  const [filters, setFilters] = useState<FilterState>(initializeFilters())
  const [date, setDate] = useState<DateRange | undefined>(filters.dateRange)

  // Update filters when URL params change
  useEffect(() => {
    setFilters(initializeFilters())
    setDate(initializeFilters().dateRange)
  }, [searchParams])

  // Обработчики изменения фильтров
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }))
  }

  const handleTypeChange = (type: keyof FilterState["type"]) => {
    setFilters((prev) => ({
      ...prev,
      type: {
        ...prev.type,
        [type]: !prev.type[type as keyof FilterState["type"]],
      },
    }))
  }

  const handleStatusChange = (status: keyof FilterState["status"]) => {
    setFilters((prev) => ({
      ...prev,
      status: {
        ...prev.status,
        [status]: !prev.status[status as keyof FilterState["status"]],
      },
    }))
  }

  const handleDisciplineChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      discipline: value,
    }))
  }

  const handleRegionChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      region: value,
    }))
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range)
    setFilters((prev) => ({
      ...prev,
      dateRange: range,
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      type: {
        open: false,
        regional: false,
        federal: false,
      },
      discipline: "",
      dateRange: undefined,
      region: "",
      status: {
        openReg: false,
        upcoming: false,
        completed: false,
      },
    })
    setDate(undefined)

    // Reset URL params
    router.push("/competitions")
  }

  const applyFilters = () => {
    // Build query params
    const params = new URLSearchParams()

    if (filters.search) {
      params.append("search", filters.search)
    }

    if (filters.type.open) {
      params.append("type", "OPEN")
    }

    if (filters.type.regional) {
      params.append("type", "REGIONAL")
    }

    if (filters.type.federal) {
      params.append("type", "FEDERAL")
    }

    if (filters.discipline && filters.discipline !== "all") {
      params.append("discipline", filters.discipline)
    }

    if (filters.region && filters.region !== "all") {
      params.append("region", filters.region)
    }

    if (filters.status.openReg) {
      params.append("status", "REGISTRATION_OPEN")
    }

    if (filters.status.upcoming) {
      params.append("status", "IN_PROGRESS")
    }

    if (filters.status.completed) {
      params.append("status", "COMPLETED")
    }

    if (filters.dateRange?.from) {
      params.append("fromDate", filters.dateRange.from.toISOString())
    }

    if (filters.dateRange?.to) {
      params.append("toDate", filters.dateRange.to.toISOString())
    }

    // Update URL with filters
    router.push(`/competitions?${params.toString()}`)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск соревнований..."
                className="pl-10"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
                {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={resetFilters}>
                <X className="h-4 w-4" /> Сбросить
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Применить
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Тип соревнования</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="open" checked={filters.type.open} onCheckedChange={() => handleTypeChange("open")} />
                      <Label htmlFor="open">Открытые</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="regional"
                        checked={filters.type.regional}
                        onCheckedChange={() => handleTypeChange("regional")}
                      />
                      <Label htmlFor="regional">Региональные</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="federal"
                        checked={filters.type.federal}
                        onCheckedChange={() => handleTypeChange("federal")}
                      />
                      <Label htmlFor="federal">Федеральные</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Статус регистрации</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="open-reg"
                        checked={filters.status.openReg}
                        onCheckedChange={() => handleStatusChange("openReg")}
                      />
                      <Label htmlFor="open-reg">Открыта регистрация</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="upcoming"
                        checked={filters.status.upcoming}
                        onCheckedChange={() => handleStatusChange("upcoming")}
                      />
                      <Label htmlFor="upcoming">Предстоящие</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="completed"
                        checked={filters.status.completed}
                        onCheckedChange={() => handleStatusChange("completed")}
                      />
                      <Label htmlFor="completed">Завершенные</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Вид спорта</Label>
                  <Select value={filters.discipline} onValueChange={handleDisciplineChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вид спорта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все виды спорта</SelectItem>
                      <SelectItem value="Футбол">Футбол</SelectItem>
                      <SelectItem value="Баскетбол">Баскетбол</SelectItem>
                      <SelectItem value="Волейбол">Волейбол</SelectItem>
                      <SelectItem value="Теннис">Теннис</SelectItem>
                      <SelectItem value="Плавание">Плавание</SelectItem>
                      <SelectItem value="Лёгкая атлетика">Лёгкая атлетика</SelectItem>
                      <SelectItem value="Гимнастика">Гимнастика</SelectItem>
                      <SelectItem value="Шахматы">Шахматы</SelectItem>
                      <SelectItem value="Лыжные гонки">Лыжные гонки</SelectItem>
                      <SelectItem value="Настольный теннис">Настольный теннис</SelectItem>
                      <SelectItem value="Бокс">Бокс</SelectItem>
                      <SelectItem value="Бадминтон">Бадминтон</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Регион</Label>
                  <Select value={filters.region} onValueChange={handleRegionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите регион" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все регионы</SelectItem>
                      <SelectItem value="Москва">Москва</SelectItem>
                      <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                      <SelectItem value="Казань">Казань</SelectItem>
                      <SelectItem value="Сочи">Сочи</SelectItem>
                      <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                      <SelectItem value="Мурманская область">Мурманская область</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Период проведения</Label>
                <DatePickerWithRange date={date} setDate={handleDateRangeChange} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
