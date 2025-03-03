'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ArrowUpCircle, ArrowDownCircle, MoreVertical, Pencil, Upload } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import Navigation from "@/components/Navigation";
import { BankAccount } from '@/types/account';
import { AddAccountModal, CreateAccountDTO } from "@/components/modals/AddAccountModal";
import { ImportAccountsModal } from "@/components/modals/ImportAccountsModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { EditAccountModal } from "@/components/modals/EditAccountModal";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'AED', name: 'Dirham Emirados Árabes' },
];

const countries = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'PT', name: 'Portugal' },
];

// Taxas de câmbio: quanto BRL vale 1 unidade da moeda
const EXCHANGE_RATES = {
  USD: 5.90,     // 1 USD = 5.90 BRL
  EUR: 5.35,     // 1 EUR = 5.35 BRL
  GBP: 6.25,     // 1 GBP = 6.25 BRL
  AED: 1.60,     // 1 AED = 1.60 BRL
  BRL: 1
} as const;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Função para converter valor para BRL
const convertToBRL = (amount: number, currency: string): number => {
  const upperCurrency = currency.toUpperCase();
  if (upperCurrency === 'BRL') return amount;
  
  const rate = EXCHANGE_RATES[upperCurrency as keyof typeof EXCHANGE_RATES] || 1;
  const result = amount * rate;
  
  console.log(`Convertendo ${amount} ${currency} para BRL:`, {
    amount,
    currency: upperCurrency,
    rate,
    result
  });
  
  return result;
};

// Função para agrupar valores por moeda
const getTotalsByCurrency = (accounts: BankAccount[]) => {
  return accounts.reduce((totals, account) => {
    const currency = account.currency.toUpperCase();
    totals[currency] = (totals[currency] || 0) + account.balance;
    return totals;
  }, {} as Record<string, number>);
};

// Cores mais vibrantes mas harmoniosas
const COLORS = [
  'hsl(222.2 47.4% 70.6%)',    // azul
  'hsl(143.8 61.2% 60.6%)',    // verde
  'hsl(346.8 77.2% 65.8%)',    // vermelho
  'hsl(48 96.5% 58.8%)',       // amarelo
  'hsl(262.1 83.3% 67.8%)'     // roxo
];

export default function BanksPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mover os cálculos para dentro do componente
  const totalBalance = accounts.reduce((sum, account) => {
    const convertedAmount = convertToBRL(account.balance, account.currency);
    return sum + convertedAmount;
  }, 0);
  
  const totalPositive = accounts.reduce((sum, account) => {
    if (account.balance > 0) {
      const convertedAmount = convertToBRL(account.balance, account.currency);
      return sum + convertedAmount;
    }
    return sum;
  }, 0);

  const totalNegative = accounts.reduce((sum, account) => {
    if (account.balance < 0) {
      const convertedAmount = convertToBRL(account.balance, account.currency);
      return sum + convertedAmount;
    }
    return sum;
  }, 0);

  // Calcula totais por moeda
  const totalsByCurrency = getTotalsByCurrency(accounts);

  // Preparar dados para os gráficos
  const pieChartData = Object.entries(totalsByCurrency).map(([currency, total]) => ({
    name: currencies.find(c => c.code.toUpperCase() === currency.toUpperCase())?.name || currency,
    value: convertToBRL(total, currency)
  }));

  const barChartData = Object.entries(
    accounts.reduce((acc, account) => {
      const bank = account.bank.toLowerCase();
      if (!acc[bank]) acc[bank] = { name: bank, value: 0 };
      acc[bank].value += convertToBRL(account.balance, account.currency);
      return acc;
    }, {} as Record<string, { name: string, value: number }>)
  ).map(([_, data]) => ({
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    value: data.value
  }));

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAccounts();
    }
  }, [status]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/accounts');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar contas');
      }

      const { data } = await response.json();
      
      // Log para debug
      console.log('Contas recebidas:', data.map((account: BankAccount) => ({
        name: account.name,
        balance: account.balance,
        currency: account.currency
      })));
      
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (accountData: CreateAccountDTO) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar conta');
      }

      await fetchAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
      alert(error instanceof Error ? error.message : 'Erro ao adicionar conta');
    }
  };

  const handleImportAccounts = async (accounts: CreateAccountDTO[]) => {
    try {
      const response = await fetch('/api/accounts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts }),
      });

      if (!response.ok) throw new Error('Erro ao importar contas');

      await fetchAccounts();
    } catch (error) {
      console.error('Error importing accounts:', error);
    }
  };

  const handleEditAccount = async (id: string, data: Partial<BankAccount>) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao editar conta');
      }

      await fetchAccounts();
    } catch (error) {
      console.error('Error editing account:', error);
      throw error;
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
      <div className="flex-1 space-y-6 p-6 md:p-8 bg-white">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium text-gray-900">Contas Bancárias</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gerencie suas contas e acompanhe seus saldos
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white text-gray-900 border-gray-900 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Conta
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  onClick={() => setIsAddModalOpen(true)}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Adicionar Manualmente</span>
                    <span className="text-xs text-gray-500">Criar uma nova conta</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsImportModalOpen(true)}
                  className="cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Importar CSV</span>
                    <span className="text-xs text-gray-500">Importar várias contas</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(totalsByCurrency).map(([currency, total]) => (
              <Card key={currency} className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total em {currencies.find(c => c.code.toUpperCase() === currency.toUpperCase())?.name}
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
            <Card className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Geral (em BRL)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-gray-900">
                  {formatCurrency(totalBalance)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Convertido para Reais
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Adicionar seção de gráficos após os cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfico de Pizza */}
          <Card className="bg-white">
            <CardHeader className="space-y-1 bg-white">
              <CardTitle className="text-base font-semibold text-gray-900">
                Distribuição por Moeda
              </CardTitle>
              <p className="text-sm text-gray-500">
                Proporção do patrimônio em cada moeda
              </p>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="h-[300px] w-full bg-white">
                <ResponsiveContainer>
                  <PieChart style={{ backgroundColor: 'white' }}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-white p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-500">
                                    {payload[0].name}
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    {formatCurrency(payload[0].value as number)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="flex gap-4 justify-center mt-4 bg-white">
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center gap-1">
                                  <div 
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-gray-600">
                                    {entry.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras */}
          <Card className="bg-white">
            <CardHeader className="space-y-1 bg-white">
              <CardTitle className="text-base font-semibold text-gray-900">
                Distribuição por Banco
              </CardTitle>
              <p className="text-sm text-gray-500">
                Total em cada instituição financeira
              </p>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="h-[300px] w-full bg-white">
                <ResponsiveContainer>
                  <BarChart 
                    data={barChartData} 
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    style={{ backgroundColor: 'white' }}
                  >
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280' }}  // text-gray-500
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}  // text-gray-500
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-white p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-gray-500">
                                    {payload[0].payload.name}
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    {formatCurrency(payload[0].value as number)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {barChartData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Suas Contas</h2>
              <p className="text-sm text-gray-500">
                {accounts.length} {accounts.length === 1 ? 'conta cadastrada' : 'contas cadastradas'}
              </p>
            </div>
          </div>
          
          {accounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="p-3 rounded-full bg-gray-50">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Você ainda não possui contas cadastradas</p>
                  <p className="text-xs text-gray-500 mt-1">Adicione sua primeira conta para começar</p>
                </div>
                <Button 
                  variant="outline"
                  className="bg-white text-gray-900 border-gray-900 hover:bg-gray-50"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Conta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Agrupar por banco */}
              {Object.entries(
                accounts.reduce((groups, account) => {
                  const bank = account.bank.toLowerCase();
                  if (!groups[bank]) groups[bank] = [];
                  groups[bank].push(account);
                  return groups;
                }, {} as Record<string, BankAccount[]>)
              ).map(([bank, bankAccounts]) => (
                <div key={bank} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-500 uppercase">
                      {bank}
                    </h3>
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-500">
                      {bankAccounts.length} {bankAccounts.length === 1 ? 'conta' : 'contas'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {bankAccounts.map((account) => (
                      <Card 
                        key={account.id} 
                        className="bg-white hover:bg-gray-50 transition-colors relative group"
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center flex-1 min-w-0 pr-4">
                            <div className="p-2 rounded-full bg-gray-50">
                              <Building2 className="h-5 w-5 text-gray-500" />
                            </div>
                            
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {account.name}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-0.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700">
                                      {countries.find(c => c.code === account.country)?.name}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700">
                                      {account.currency.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-sm font-medium ${
                                    account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                                  }`}>
                                    {new Intl.NumberFormat(account.country === 'BR' ? 'pt-BR' : 'en-US', {
                                      style: 'currency',
                                      currency: account.currency.toUpperCase()
                                    }).format(account.balance)}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Saldo atual
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Botão de edição */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => {
                                setSelectedAccount(account);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Subtotal do banco */}
                    <div className="flex justify-end px-4 pt-2">
                      <div className="text-sm text-gray-500">
                        Total em {bank}:{' '}
                        <span className="font-medium text-gray-900">
                          {formatCurrency(
                            bankAccounts.reduce((sum, account) => {
                              const convertedAmount = convertToBRL(account.balance, account.currency);
                              return sum + convertedAmount;
                            }, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAccount}
        />

        <ImportAccountsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImportAccounts}
        />

        {selectedAccount && (
          <EditAccountModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAccount(null);
            }}
            onEdit={handleEditAccount}
            account={selectedAccount}
          />
        )}
      </div>
    </PageWrapper>
  );
} 