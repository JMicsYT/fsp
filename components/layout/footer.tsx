import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-lg font-bold">
            СЦР
          </Link>
          <p className="text-sm text-muted-foreground">
            Платформа для организации и участия в спортивных соревнованиях по всей России
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Платформа</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/competitions" className="text-sm text-muted-foreground hover:text-foreground">
                Соревнования
              </Link>
              <Link href="/teams" className="text-sm text-muted-foreground hover:text-foreground">
                Команды
              </Link>
              <Link href="/rankings" className="text-sm text-muted-foreground hover:text-foreground">
                Рейтинг
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Ресурсы</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                О платформе
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Контакты
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Правовая информация</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Условия использования
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Политика конфиденциальности
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="container py-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} СЦР. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
