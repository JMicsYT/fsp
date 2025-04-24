"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const navigation = [
    { name: "Главная", href: "/" },
    { name: "Соревнования", href: "/competitions" },
    { name: "Команды", href: "/teams" },
    { name: "Рейтинг", href: "/rankings" },
    { name: "О платформе", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">СЦР</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/profile">
                  <Button variant="default" size="sm">
                    {session.user.name || session.user.email}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Войти</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" size="sm">Регистрация</Button>
                </Link>
              </>
            )}
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  {session?.user ? (
                    <>
                      <Link href="/profile">
                        <Button className="w-full">
                          {session.user.name || session.user.email}
                        </Button>
                      </Link>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Выйти
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login">
                        <Button className="w-full mb-2">Войти</Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button className="w-full">Регистрация</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
