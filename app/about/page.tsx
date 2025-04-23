import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "О платформе | СпортРейтинг",
  description: "Информация о платформе СпортРейтинг для организации и участия в спортивных соревнованиях",
}

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">О платформе</h1>
          <p className="text-muted-foreground">
            Информация о платформе СЦР для организации и участия в спортивных соревнованиях
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
            <p className="mb-4">
              Платформа <strong>СЦР</strong> создана для объединения спортивного сообщества России, упрощения
              организации соревнований и повышения доступности спорта для всех желающих.
            </p>
            <p className="mb-4">
              Мы стремимся создать единую экосистему, где спортсмены, тренеры, организаторы соревнований и болельщики
              могут взаимодействовать, находить информацию и участвовать в спортивных мероприятиях по всей стране.
            </p>
            <p>Наша цель — сделать спорт доступнее, а организацию соревнований — проще и эффективнее.</p>
          </div>
          <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">СЦР</h3>
              <p className="text-muted-foreground">Объединяем спортивное сообщество России с 2025 года</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="platform">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="platform">О платформе</TabsTrigger>
            <TabsTrigger value="team">Наша команда</TabsTrigger>
            <TabsTrigger value="faq">Частые вопросы</TabsTrigger>
          </TabsList>
          <TabsContent value="platform" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>Запуск платформы</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Платформа СЦР разрабатывается в 2025 году группой студентов.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Пользователи</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Сегодня нашими пользователями являются более 0+ спортсменов и 0+ поскольку данная платформа в разработке.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <CardTitle>Соревнования</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    За время работы платформы было организовано 0+ соревнований различного уровня в 0+ видах
                    спорта также по темже причинам что проект находится на стадии разработки.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Возможности платформы</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Организация соревнований</h4>
                    <p className="text-sm text-muted-foreground">
                      Создавайте и управляйте соревнованиями любого масштаба
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Управление командами</h4>
                    <p className="text-sm text-muted-foreground">Формируйте команды и приглашайте участников</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Рейтинг спортсменов</h4>
                    <p className="text-sm text-muted-foreground">Отслеживайте достижения и рейтинг спортсменов</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Аналитика и статистика</h4>
                    <p className="text-sm text-muted-foreground">
                      Получайте подробную статистику по соревнованиям и участникам
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Региональные ограничения</h4>
                    <p className="text-sm text-muted-foreground">
                      Настраивайте региональные ограничения для соревнований
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Портфолио достижений</h4>
                    <p className="text-sm text-muted-foreground">Ведите учет всех спортивных достижений</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/competitions">
                <Button size="lg">Начать использовать платформу</Button>
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="team" className="mt-6 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-2">Наша команда</h3>
              <p className="text-muted-foreground mb-8">
                Платформа СЦР создана командой студентов, объединенных любовью к технологиям и разработкой подобных проектов.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "Рижко Денис", role: "Руководитель проекта", avatar: "/team/01.png" },
                { name: "Куликов Олег", role: "Fullstack-разработчик", avatar: "/team/02.png" },
                { name: "Адаменко Кирилл", role: "Младший аналитик данных", avatar: "/team/03.png" },
                { name: "Коваленко Данилл", role: "Дизайнер интерфейсов", avatar: "/team/04.png" },
                { name: "Туманов Николай", role: "Программист", avatar: "/team/05.png" },
          
              ].map((member, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-40 bg-muted flex items-center justify-center">
                    <Users className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="faq" className="mt-6 space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-xl font-bold mb-2">Часто задаваемые вопросы</h3>
              <p className="text-muted-foreground">Ответы на самые популярные вопросы о платформе СЦР</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  question: "Как зарегистрироваться на платформе?",
                  answer:
                    "Для регистрации на платформе необходимо нажать кнопку 'Регистрация' в правом верхнем углу сайта и заполнить форму с личными данными. После подтверждения email вы сможете пользоваться всеми функциями платформы.",
                },
                {
                  question: "Как создать соревнование?",
                  answer:
                    "Для создания соревнования необходимо войти в личный кабинет, перейти в раздел 'Соревнования' и нажать кнопку 'Создать соревнование'. Далее следуйте инструкциям по заполнению информации о соревновании.",
                },
                {
                  question: "Как сформировать команду?",
                  answer:
                    "Чтобы сформировать команду, найдите интересующее вас соревнование, нажмите кнопку 'Создать команду' и пригласите участников, указав их идентификационные номера или email-адреса.",
                },
                {
                  question: "Как рассчитывается рейтинг спортсменов?",
                  answer:
                    "Рейтинг спортсменов рассчитывается на основе результатов участия в соревнованиях. За каждое соревнование начисляются баллы в зависимости от занятого места и уровня соревнования. Рейтинг обновляется еженедельно.",
                },
                {
                  question: "Могу ли я участвовать в соревнованиях из другого региона?",
                  answer:
                    "Это зависит от типа соревнования. Открытые соревнования доступны для участников из любых регионов, региональные — только для спортсменов из указанного региона, федеральные — по приглашению от региональных представителей.",
                },
                {
                  question: "Как подтвердить свое участие в команде?",
                  answer:
                    "После получения приглашения в команду вы получите уведомление в личном кабинете и на email. Для подтверждения участия необходимо перейти в раздел 'Приглашения' и нажать кнопку 'Принять'.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="mb-4">Не нашли ответ на свой вопрос?</p>
              <Link href="/contact">
                <Button>Связаться с нами</Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
