import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { UpcomingCompetitions } from "@/components/home/upcoming-competitions"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { StatsSection } from "@/components/home/stats-section"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />

      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Предстоящие соревнования</h2>
            <Link href="/competitions">
              <Button variant="ghost" className="gap-1">
                Все соревнования <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <UpcomingCompetitions />
        </div>
      </section>

      <FeaturesSection />
      <StatsSection />
    </div>
  )
}
