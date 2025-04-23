import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Страница не найдена</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Извините, запрашиваемая страница не существует или была перемещена.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/competitions">Соревнования</Link>
        </Button>
      </div>
    </div>
  )
}
