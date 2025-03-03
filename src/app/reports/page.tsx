'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import Navigation from "@/components/Navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  byCategory: {
    [key: string]: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function ReportsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchReport();
    }
  }, [status, selectedPeriod]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/reports?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar relatório');
      }

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`/api/reports/export?period=${selectedPeriod}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao exportar relatório');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${selectedPeriod}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Erro ao exportar relatório. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-900">Carregando...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navigation />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-medium text-gray-900">Relatórios</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {selectedPeriod === 'current-month' ? 'Mês Atual' : 
                 selectedPeriod === 'last-month' ? 'Mês Anterior' : 
                 'Últimos 3 Meses'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-gray-200">
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('current-month')}
                className="text-gray-700 hover:bg-gray-100"
              >
                Mês Atual
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('last-month')}
                className="text-gray-700 hover:bg-gray-100"
              >
                Mês Anterior
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedPeriod('last-3-months')}
                className="text-gray-700 hover:bg-gray-100"
              >
                Últimos 3 Meses
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            size="sm"
            onClick={handleExportPDF}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Receitas
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-emerald-600">
                {formatCurrency(report?.totalIncome || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Despesas
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-red-600">
                {formatCurrency(report?.totalExpenses || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Saldo
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${(report?.netProfit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-light ${(report?.netProfit || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(report?.netProfit || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Economia
              </CardTitle>
              <PieChart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-blue-600">
                {report?.netProfit && report.totalIncome 
                  ? `${Math.round((report.netProfit / report.totalIncome) * 100)}%`
                  : '0%'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-900">
                Despesas por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report?.byCategory && Object.entries(report.byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-900" />
                        <span className="text-sm font-medium text-gray-900">{category}</span>
                      </div>
                      <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-900">
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Gráfico em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
} 