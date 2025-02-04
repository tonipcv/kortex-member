"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export function BlogClient() {
  // Exemplo de dados de blog (substitua por dados reais do seu backend)
  const posts = [
    {
      id: "1",
      title: "Como começar na programação",
      author: "João Silva",
      publishedAt: "10/03/2024",
      status: "Publicado",
    },
    {
      id: "2",
      title: "Melhores práticas em React",
      author: "Maria Santos",
      publishedAt: "15/03/2024",
      status: "Publicado",
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={posts} />
    </div>
  )
} 