import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function ClientsPage() {
  const leads = await prisma.lead.findMany({
    include: {
      link: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedLeads = leads.map(lead => ({
    id: lead.id,
    name: lead.name || '-',
    email: lead.email || '-',
    whatsapp: lead.whatsapp || '-',
    source: lead.link.title,
    createdAt: format(lead.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Clientes"
        description="Gerencie seus leads capturados"
      />
      <Separator />
      <DataTable
        columns={[
          { accessorKey: "name", header: "Nome" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "whatsapp", header: "WhatsApp" },
          { accessorKey: "source", header: "Origem" },
          { accessorKey: "createdAt", header: "Data" },
        ]}
        data={formattedLeads}
      />
    </div>
  )
} 