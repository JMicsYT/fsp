import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Контакты | СЦР",
  description: "Свяжитесь с нами - СЦР",
}

export default function ContactPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Контакты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mb-6">
              У вас есть вопросы или предложения? Заполните форму, и мы свяжемся с вами в ближайшее время.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Отправить сообщение</CardTitle>
                <CardDescription>Заполните форму ниже, чтобы отправить нам сообщение</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Введите ваше имя" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Введите ваш email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Тема</Label>
                  <Input id="subject" placeholder="Введите тему сообщения" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Сообщение</Label>
                  <Textarea id="message" placeholder="Введите ваше сообщение" rows={5} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Отправить сообщение</Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Контактная информация</h2>
            <p className="text-muted-foreground mb-6">
              Вы также можете связаться с нами по следующим контактным данным:
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">info@sportrating.ru</p>
                  <p className="text-muted-foreground">support@sportrating.ru</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Телефон</h3>
                  <p className="text-muted-foreground">+7 (999) 111-11-11</p>
                  <p className="text-muted-foreground">+7 (990) 000-00-00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Адрес</h3>
                  <p className="text-muted-foreground">г. Мелитополь, ул. Примерно, д. 123</p>
                  <p className="text-muted-foreground">Индекс: 123456</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-2">Часы работы</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>Понедельник - Пятница</div>
                  <div>9:00 - 18:00</div>
                  <div>Суббота</div>
                  <div>10:00 - 15:00</div>
                  <div>Воскресенье</div>
                  <div>Выходной</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
