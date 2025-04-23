import { Calendar, Trophy, Users, Filter, BarChart, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Организация соревнований",
      description: "Создавайте открытые, региональные и федеральные соревнования с гибкими настройками",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Управление командами",
      description: "Формируйте команды, приглашайте участников и находите спортсменов для неполных составов",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Портфолио достижений",
      description: "Автоматическое обновление профилей спортсменов с историей участия и результатами",
    },
    {
      icon: <Filter className="h-10 w-10 text-primary" />,
      title: "Умный поиск",
      description: "Находите соревнования по дате, виду спорта и региону",
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Региональные ограничения",
      description: "Автоматическая проверка региональной принадлежности участников",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Аналитика и статистика",
      description: "Подробная аналитика соревнований и достижений с возможностью выгрузки данных",
    },
  ]

  return (
    <section className="container px-4 md:px-6 py-8 md:py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Возможности платформы</h2>
        <p className="text-muted-foreground md:text-lg max-w-3xl mx-auto">
          Полный набор инструментов для организации и участия в спортивных соревнованиях
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col p-6 bg-card rounded-lg border shadow-sm">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
