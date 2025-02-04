"use client"

interface DataTableProps<TData> {
  columns: {
    header: string
    accessorKey: string
  }[]
  data: TData[]
}

export function DataTable<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.accessorKey}
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row: any, i) => (
              <tr key={i} className="border-b">
                {columns.map((column) => (
                  <td
                    key={column.accessorKey}
                    className="p-4 align-middle"
                  >
                    {row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center"
              >
                Nenhum resultado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
} 