import type { Metadata } from "next"
import CreateCompetitionClientPage from "./CreateCompetitionClientPage"

export const metadata: Metadata = {
  title: "Создание соревнования | Платформа соревнований по спортивному программированию",
  description: "Создание нового соревнования по спортивному программированию",
}

export default function CreateCompetitionPage() {
  return <CreateCompetitionClientPage />
}
