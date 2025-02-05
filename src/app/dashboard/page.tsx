'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';

// Dados de exemplo para o gráfico de área
const revenueData = [
  { month: 'Jan', revenue: 8500 },
  { month: 'Feb', revenue: 10000 },
  { month: 'Mar', revenue: 12000 },
  { month: 'Apr', revenue: 11500 },
  { month: 'May', revenue: 13500 },
  { month: 'Jun', revenue: 16000 },
  { month: 'Jul', revenue: 18500 },
  { month: 'Aug', revenue: 20000 },
  { month: 'Sep', revenue: 22500 },
  { month: 'Oct', revenue: 25000 },
  { month: 'Nov', revenue: 27500 },
  { month: 'Dec', revenue: 30000 },
];

// Dados de exemplo para o gráfico de pizza
const planData = [
  { name: 'Basic', value: 30, color: '#94A3B8' },  // Slate-400
  { name: 'Pro', value: 45, color: '#38BDF8' },    // Sky-400
  { name: 'Enterprise', value: 25, color: '#2DD4BF' }  // Teal-400
];

// Métricas
const metrics = {
  mrr: 30000,
  revenue: 360000,
  customers: 1250,
  churnRate: 1.8,
  previousMrr: 27000,
  previousRevenue: 324000,
  previousCustomers: 1100,
  previousChurnRate: 2.2,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value);
};

const calculateGrowth = (current: number, previous: number) => {
  return ((current - previous) / previous) * 100;
};

// Dados de exemplo para transações recentes
const recentTransactions = [
  { id: 1, customer: 'Enterprise Co Ltd', plan: 'Enterprise', amount: 1999, date: '2024-03-20' },
  { id: 2, customer: 'Startup XYZ', plan: 'Pro', amount: 699, date: '2024-03-19' },
  { id: 3, customer: 'John Smith Ltd', plan: 'Basic', amount: 299, date: '2024-03-19' },
  { id: 4, customer: 'Tech Solutions', plan: 'Pro', amount: 699, date: '2024-03-18' },
  { id: 5, customer: 'Digital Corp', plan: 'Enterprise', amount: 1999, date: '2024-03-18' },
];

// Adicione esses novos dados de exemplo
const monthlyMetrics = [
  { month: 'Jan', newCustomers: 45, churnedCustomers: 12, revenue: 8500, expenses: 4200, cac: 125, ltv: 890 },
  { month: 'Feb', newCustomers: 52, churnedCustomers: 8, revenue: 10000, expenses: 4800, cac: 120, ltv: 920 },
  { month: 'Mar', newCustomers: 61, churnedCustomers: 15, revenue: 12000, expenses: 5100, cac: 118, ltv: 950 },
  { month: 'Apr', newCustomers: 48, churnedCustomers: 10, revenue: 11500, expenses: 5300, cac: 122, ltv: 945 },
  { month: 'May', newCustomers: 65, churnedCustomers: 13, revenue: 13500, expenses: 5600, cac: 115, ltv: 980 },
  { month: 'Jun', newCustomers: 72, churnedCustomers: 11, revenue: 16000, expenses: 6200, cac: 112, ltv: 1020 },
];

const revenueByPlan = [
  { name: 'Basic', value: 125000 },
  { name: 'Pro', value: 280000 },
  { name: 'Enterprise', value: 495000 },
];

export default function DashboardPage() {
  const { isMobile } = useWindowSize();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* MRR Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  MRR (Monthly Recurring Revenue)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.mrr)}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {calculateGrowth(metrics.mrr, metrics.previousMrr) > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "ml-1",
                    calculateGrowth(metrics.mrr, metrics.previousMrr) > 0 
                      ? "text-green-500" 
                      : "text-red-500"
                  )}>
                    {Math.abs(calculateGrowth(metrics.mrr, metrics.previousMrr)).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {calculateGrowth(metrics.revenue, metrics.previousRevenue) > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "ml-1",
                    calculateGrowth(metrics.revenue, metrics.previousRevenue) > 0 
                      ? "text-green-500" 
                      : "text-red-500"
                  )}>
                    {Math.abs(calculateGrowth(metrics.revenue, metrics.previousRevenue)).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Customers Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.customers}</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {calculateGrowth(metrics.customers, metrics.previousCustomers) > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "ml-1",
                    calculateGrowth(metrics.customers, metrics.previousCustomers) > 0 
                      ? "text-green-500" 
                      : "text-red-500"
                  )}>
                    {Math.abs(calculateGrowth(metrics.customers, metrics.previousCustomers)).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Churn Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Churn Rate
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.churnRate}%</div>
                <div className="flex items-center pt-1 text-xs text-muted-foreground">
                  {calculateGrowth(metrics.churnRate, metrics.previousChurnRate) < 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "ml-1",
                    calculateGrowth(metrics.churnRate, metrics.previousChurnRate) < 0 
                      ? "text-green-500" 
                      : "text-red-500"
                  )}>
                    {Math.abs(calculateGrowth(metrics.churnRate, metrics.previousChurnRate)).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "h-[300px]" : "h-[400px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={
                  isMobile ? { top: 10, right: 10, left: -20, bottom: 0 } 
                          : { top: 10, right: 30, left: 0, bottom: 0 }
                }>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `£ ${value/1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Planos - Design atualizado */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Planos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      index
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          className="text-sm fill-current"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {planData[index].name} ({value}%)
                        </text>
                      );
                    }}
                  >
                    {planData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="stroke-background hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-muted-foreground">{transaction.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Customer Acquisition Cost (CAC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyMetrics[5].cac)}</div>
                <p className="text-xs text-muted-foreground">Average cost to acquire a new customer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Lifetime Value (LTV)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(monthlyMetrics[5].ltv)}</div>
                <p className="text-xs text-muted-foreground">Average revenue per customer</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">LTV/CAC Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(monthlyMetrics[5].ltv / monthlyMetrics[5].cac).toFixed(2)}x
                </div>
                <p className="text-xs text-muted-foreground">Ideal ratio is 3x or higher</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyMetrics}>
                  <defs>
                    <linearGradient id="colorNewCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorChurnedCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="newCustomers" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorNewCustomers)" 
                    name="New Customers"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="churnedCustomers" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorChurnedCustomers)" 
                    name="Churned Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue and Expenses */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `£${value/1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#38bdf8" 
                      fill="#38bdf8" 
                      fillOpacity={0.2}
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#f43f5e" 
                      fill="#f43f5e" 
                      fillOpacity={0.2}
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Plan</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByPlan}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {revenueByPlan.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={planData[index].color}
                          className="stroke-background hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Month</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">New Customers</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Churned</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Revenue</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CAC</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">LTV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyMetrics.map((metric) => (
                      <tr key={metric.month} className="border-b">
                        <td className="p-4 align-middle">{metric.month}</td>
                        <td className="p-4 align-middle">{metric.newCustomers}</td>
                        <td className="p-4 align-middle">{metric.churnedCustomers}</td>
                        <td className="p-4 align-middle">{formatCurrency(metric.revenue)}</td>
                        <td className="p-4 align-middle">{formatCurrency(metric.cac)}</td>
                        <td className="p-4 align-middle">{formatCurrency(metric.ltv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 