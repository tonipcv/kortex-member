'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wallet,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
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

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  creditCardsTotal: number;
  accountsByCurrency: Record<string, number>;
  recentTransactions: {
    id: string;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    date: string;
    category: string;
  }[];
  upcomingBills: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    paid: boolean;
  }[];
  expensesByCategory: {
    [key: string]: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Adicionar as constantes de taxas e funções de conversão
const EXCHANGE_RATES = {
  USD: 5.90,     // 1 USD = 5.90 BRL
  EUR: 5.35,     // 1 EUR = 5.35 BRL
  GBP: 6.25,     // 1 GBP = 6.25 BRL
  AED: 1.60,     // 1 AED = 1.60 BRL
  BRL: 1
} as const;

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'AED', name: 'Dirham Emirados Árabes' },
];

// Função para converter valor para BRL
const convertToBRL = (amount: number, currency: string): number => {
  if (currency === 'BRL') return amount;
  const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1;
  return amount * rate;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/dashboard?period=${selectedPeriod}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do dashboard');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-medium text-gray-900">Dashboard</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {selectedPeriod === 'current-month' ? 'Mês Atual' : selectedPeriod === 'last-month' ? 'Mês Anterior' : 'Últimos 3 Meses'}
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
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data?.accountsByCurrency || {}).map(([currency, total]) => (
            <Card key={currency} className="bg-white border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total em {currencies.find(c => c.code === currency)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-900">
                  {new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
                    style: 'currency',
                    currency: currency
                  }).format(total)}
                </div>
                {currency !== 'BRL' && (
                  <p className="text-xs text-gray-500 mt-1">
                    ≈ {formatCurrency(convertToBRL(total, currency))}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Card com Total Geral em BRL */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Geral (em BRL)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-gray-900">
                {formatCurrency(data?.totalBalance || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Convertido para Reais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* Transações Recentes - 4 colunas */}
          <Card className="md:col-span-4 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-900">
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' 
                          ? <ArrowUpCircle className="h-4 w-4" />
                          : <ArrowDownCircle className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'income' 
                          ? 'text-emerald-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contas a Pagar - 3 colunas */}
          <Card className="md:col-span-3 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-gray-900">
                Próximas Contas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.upcomingBills.map((bill) => (
                  <div 
                    key={bill.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{bill.description}</p>
                      <p className="text-sm text-gray-600">
                        Vence em {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(bill.amount)}
                      </p>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        bill.paid 
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {bill.paid ? 'Pago' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                ))}
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
                {data?.expensesByCategory && Object.entries(data.expensesByCategory)
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