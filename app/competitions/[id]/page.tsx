import type { Metadata } from "next"
import CompetitionDetailsClientPage from "./CompetitionDetailsClientPage"

export const metadata: Metadata = {
  title: "Детали соревнования | Платформа соревнований по спортивному программированию",
  description: "Подробная информация о соревновании по спортивному программированию",
}

export default function CompetitionDetailsPage({ params }: { params: { id: string } }) {
  return <CompetitionDetailsClientPage params={params} />
}
