import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { BlogClient } from "./components/client"

export default function BlogPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Blog"
          description="Artigos e novidades sobre tecnologia"
        />
      </div>
      <Separator />
      <BlogClient />
    </div>
  )
} 