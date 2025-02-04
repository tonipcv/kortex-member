"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

export function CourseClient() {
  // Exemplo de dados de cursos (substitua por dados reais do seu backend)
  const courses = [
    {
      id: "1",
      title: "Curso de JavaScript",
      price: "R$ 199,00",
      createdAt: "10/03/2024",
    },
    {
      id: "2",
      title: "Curso de React",
      price: "R$ 299,00",
      createdAt: "15/03/2024",
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={courses} />
    </div>
  )
} 