'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useWindowSize } from '@/hooks/useWindowSize';

// Dados de tráfego e conversão
const trafficData = [
  { month: 'Jan', visitors: 15200, conversions: 380, organicTraffic: 9500, paidTraffic: 5700 },
  { month: 'Feb', visitors: 18500, conversions: 425, organicTraffic: 11200, paidTraffic: 7300 },
  { month: 'Mar', visitors: 22000, conversions: 520, organicTraffic: 13500, paidTraffic: 8500 },
  { month: 'Apr', visitors: 21000, conversions: 490, organicTraffic: 12800, paidTraffic: 8200 },
  { month: 'May', visitors: 25000, conversions: 580, organicTraffic: 15200, paidTraffic: 9800 },
  { month: 'Jun', visitors: 28000, conversions: 650, organicTraffic: 17000, paidTraffic: 11000 },
];

// Dados de origem do tráfego
const trafficSources = [
  { name: 'Organic Search', value: 45, color: '#38bdf8' },
  { name: 'Paid Search', value: 25, color: '#8b5cf6' },
  { name: 'Social Media', value: 15, color: '#2dd4bf' },
  { name: 'Direct', value: 10, color: '#94a3b8' },
  { name: 'Referral', value: 5, color: '#6366f1' },
];

// Dados de campanhas
const campaigns = [
  { name: 'Summer Sale', clicks: 12500, conversions: 850, spend: 5000, revenue: 25000 },
  { name: 'Product Launch', clicks: 18000, conversions: 1200, spend: 8000, revenue: 45000 },
  { name: 'Black Friday', clicks: 25000, conversions: 2100, spend: 12000, revenue: 85000 },
  { name: 'Holiday Special', clicks: 15000, conversions: 950, spend: 6000, revenue: 35000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-GB').format(value);
};

const calculateROI = (revenue: number, spend: number) => {
  return ((revenue - spend) / spend * 100).toFixed(1);
};

export default function AnalyticsPage() {
  const { isMobile } = useWindowSize();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards responsivos */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(28000)}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.32%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3m 45s</div>
                <p className="text-xs text-muted-foreground">+15s from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">285%</div>
                <p className="text-xs text-muted-foreground">+25% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de tráfego responsivo */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent className={isMobile ? "h-[300px]" : "h-[400px]"}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={trafficData}
                  margin={isMobile ? { top: 10, right: 10, left: -20, bottom: 0 } 
                                 : { top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorVisitors)" 
                    name="Visitors"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Traffic Sources e Campaign Performance */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "h-[250px]" : "h-[300px]"}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={isMobile ? { top: 0, right: 0, left: -20, bottom: 0 } 
                                           : { top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 40 : 60}
                      outerRadius={isMobile ? 60 : 80}
                      paddingAngle={8}
                      dataKey="value"
                      label={isMobile ? undefined : ({ name, value }) => `${name}: ${value}%`}
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="transition-opacity duration-200 hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 md:space-y-4">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.name}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ROI: {calculateROI(campaign.revenue, campaign.spend)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(campaign.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.conversions} conversions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources Comparison</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  <Bar 
                    dataKey="organicTraffic" 
                    name="Organic Traffic"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="paidTraffic" 
                    name="Paid Traffic"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.name}>
                <CardHeader>
                  <CardTitle>{campaign.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="text-2xl font-bold">{formatNumber(campaign.clicks)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">{formatNumber(campaign.conversions)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spend</p>
                      <p className="text-2xl font-bold">{formatCurrency(campaign.spend)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-2xl font-bold">{calculateROI(campaign.revenue, campaign.spend)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 