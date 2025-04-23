import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Платформа для спортивных соревнований
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Организуйте соревнования, создавайте команды и участвуйте в турнирах по всей России
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/competitions">
                <Button size="lg" className="gap-1">
                  Найти соревнование <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline">
                  Зарегистрироваться
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last">
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-background rounded-xl border flex items-center justify-center">
              <div className="p-8 text-center">
                <div className="text-5xl font-bold mb-4">20+</div>
                <p className="text-muted-foreground">видов спорта</p>
                <div className="mt-8 text-5xl font-bold mb-4">1000+</div>
                <p className="text-muted-foreground">участников</p>
                <div className="mt-8 text-5xl font-bold mb-4">50+</div>
                <p className="text-muted-foreground">регионов России</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
