import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { CourseClient } from "./components/client"

export default function CoursesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Cursos Disponíveis"
          description="Explore nossa seleção de cursos"
        />
      </div>
      <Separator />
      <CourseClient />
    </div>
  )
} 