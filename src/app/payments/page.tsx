'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';
import { ColumnDef } from "@tanstack/react-table";

// Dados mensais de pagamentos
const monthlyPayments = [
  { month: 'Jan', total: 28500, successful: 26800, failed: 1700 },
  { month: 'Feb', total: 32000, successful: 30500, failed: 1500 },
  { month: 'Mar', total: 35000, successful: 33800, failed: 1200 },
  { month: 'Apr', total: 33500, successful: 32000, failed: 1500 },
  { month: 'May', total: 38500, successful: 37200, failed: 1300 },
  { month: 'Jun', total: 42000, successful: 40800, failed: 1200 },
];

// Primeiro definimos a interface
interface Payment {
  id: string;
  customer: string;
  plan: string;
  amount: number;
  status: 'Successful' | 'Failed' | 'Pending';
  date: string;
  paymentMethod: string;
  invoiceId: string;
}

// Depois usamos a interface para tipar os dados
const payments: Payment[] = [
  {
    id: '1',
    customer: 'Enterprise Co Ltd',
    plan: 'Enterprise',
    amount: 2999,
    status: 'Successful',
    date: '2024-03-20',
    paymentMethod: 'Visa ending in 4242',
    invoiceId: 'INV-001'
  },
  {
    id: '2',
    customer: 'Startup XYZ',
    plan: 'Pro',
    amount: 999,
    status: 'Successful' as const,
    date: '2024-03-19',
    paymentMethod: 'Mastercard ending in 5555',
    invoiceId: 'INV-002'
  },
  {
    id: '3',
    customer: 'John Smith Ltd',
    plan: 'Basic',
    amount: 299,
    status: 'Failed' as const,
    date: '2024-03-19',
    paymentMethod: 'Mastercard ending in 8888',
    invoiceId: 'INV-003'
  },
  {
    id: '4',
    customer: 'Tech Solutions',
    plan: 'Pro',
    amount: 699,
    status: 'Pending' as const,
    date: '2024-03-18',
    paymentMethod: 'PayPal',
    invoiceId: 'INV-004'
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value);
};

// Atualize a definição das colunas com tipagem
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString('en-GB')
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.getValue("amount"))
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment['status'];
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'Successful' ? 'bg-green-500/20 text-green-500' :
          status === 'Failed' ? 'bg-red-500/20 text-red-500' :
          'bg-yellow-500/20 text-yellow-500'
        }`}>
          {status}
        </span>
      );
    }
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "invoiceId",
    header: "Invoice ID",
  },
];

export default function PaymentsPage() {
  const { isMobile } = useWindowSize();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="successful">Successful</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {/* Summary Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(42000)}</div>
                  <p className="text-xs text-muted-foreground">+9.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">97.1%</div>
                  <p className="text-xs text-muted-foreground">+0.8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(1499)}</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "h-[300px]" : "h-[400px]"}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={monthlyPayments}
                    margin={isMobile ? { top: 10, right: 10, left: -20, bottom: 0 } 
                                   : { top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `£${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#38bdf8" 
                      fillOpacity={1} 
                      fill="url(#colorTotal)" 
                      name="Total Payments"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable<Payment, unknown> columns={columns} data={payments} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="successful">
          <Card>
            <CardContent className="pt-6">
              <DataTable<Payment, unknown>
                columns={columns} 
                data={payments.filter(p => p.status === 'Successful')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardContent className="pt-6">
              <DataTable<Payment, unknown>
                columns={columns} 
                data={payments.filter(p => p.status === 'Failed')}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Success vs Failed Payments</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPayments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `£${value/1000}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar 
                      dataKey="successful" 
                      fill="#22c55e" 
                      name="Successful"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="failed" 
                      fill="#ef4444" 
                      name="Failed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 