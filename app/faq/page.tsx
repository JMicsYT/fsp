import type { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Часто задаваемые вопросы | СЦР",
  description: "Ответы на часто задаваемые вопросы о платформе СРЦ",
}

export default function FAQPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Часто задаваемые вопросы</h1>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Общие вопросы</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Что такое СЦР?</AccordionTrigger>
                <AccordionContent>
                  СЦР - это платформа для организации и проведения соревнований по различным видам спорта. Мы
                  помогаем организаторам создавать и управлять соревнованиями, а участникам - находить и
                  регистрироваться на интересующие их мероприятия.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Как зарегистрироваться на платформе?</AccordionTrigger>
                <AccordionContent>
                  Для регистрации на платформе нажмите кнопку "Регистрация" в правом верхнем углу сайта. Заполните
                  необходимые поля и подтвердите свой email. После этого вы сможете войти в систему и пользоваться всеми
                  функциями платформы.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Какие виды спорта поддерживает платформа?</AccordionTrigger>
                <AccordionContent>
                  СЦР поддерживает широкий спектр видов спорта, включая футбол, баскетбол, волейбол, теннис,
                  плавание, легкую атлетику и многие другие. Если вы не нашли нужный вид спорта, свяжитесь с нами, и мы
                  рассмотрим возможность его добавления.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Для участников</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-4">
                <AccordionTrigger>Как зарегистрироваться на соревнование?</AccordionTrigger>
                <AccordionContent>
                  Для регистрации на соревнование найдите интересующее вас мероприятие в разделе "Соревнования",
                  перейдите на страницу соревнования и нажмите кнопку "Регистрация". Заполните необходимые данные и
                  подтвердите свое участие.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Как создать команду для участия в соревновании?</AccordionTrigger>
                <AccordionContent>
                  Для создания команды перейдите в раздел "Команды" и нажмите кнопку "Создать команду". Укажите название
                  команды, выберите соревнование и пригласите участников. После формирования команды вы сможете
                  зарегистрировать ее на соревнование.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Как узнать результаты соревнования?</AccordionTrigger>
                <AccordionContent>
                  Результаты соревнования публикуются на странице соревнования после его завершения. Также вы можете
                  найти результаты в разделе "Рейтинг", где отображается общий рейтинг спортсменов и команд.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Для организаторов</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-7">
                <AccordionTrigger>Как создать соревнование?</AccordionTrigger>
                <AccordionContent>
                  Для создания соревнования войдите в систему как организатор, перейдите в раздел "Организатор" и
                  нажмите кнопку "Создать соревнование". Заполните информацию о соревновании, укажите даты, правила и
                  другие необходимые данные.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>Как управлять заявками на участие?</AccordionTrigger>
                <AccordionContent>
                  Управление заявками на участие доступно в разделе "Организатор" на вкладке "Регистрации". Здесь вы
                  можете просматривать все заявки, подтверждать или отклонять их, а также отправлять уведомления
                  участникам.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9">
                <AccordionTrigger>Как добавить результаты соревнования?</AccordionTrigger>
                <AccordionContent>
                  Для добавления результатов соревнования перейдите на страницу соревнования в разделе "Организатор" и
                  выберите вкладку "Результаты". Здесь вы можете внести результаты для каждого участника или команды, а
                  также загрузить итоговый протокол соревнования.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Технические вопросы</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-10">
                <AccordionTrigger>Что делать, если я забыл пароль?</AccordionTrigger>
                <AccordionContent>
                  Если вы забыли пароль, нажмите на ссылку "Забыли пароль?" на странице входа. Введите свой email, и мы
                  отправим вам инструкции по восстановлению пароля.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-11">
                <AccordionTrigger>Как изменить личные данные?</AccordionTrigger>
                <AccordionContent>
                  Для изменения личных данных перейдите в раздел "Профиль" и нажмите на кнопку "Редактировать профиль".
                  Внесите необходимые изменения и сохраните их.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-12">
                <AccordionTrigger>Как связаться с технической поддержкой?</AccordionTrigger>
                <AccordionContent>
                  Для связи с технической поддержкой воспользуйтесь формой обратной связи на странице "Контакты" или
                  напишите нам на email support@sportrating.ru. Мы постараемся ответить на ваш запрос в течение 24
                  часов.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}
