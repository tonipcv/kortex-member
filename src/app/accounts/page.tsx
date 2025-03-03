'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/PageWrapper";
import Navigation from "@/components/Navigation";
import { BankAccount } from '@/types/account';
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { BankTransactionDTO } from '@/types/transaction';
import { AddAccountModal, CreateAccountDTO } from "@/components/modals/AddAccountModal";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function AccountsPage() {
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
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar contas');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
    setSelectedAccountId(undefined);
  };

  const handleAddTransaction = async (transactionData: BankTransactionDTO) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao adicionar transação');
      }

      // Recarrega as contas para atualizar o saldo
      await fetchAccounts();
      handleCloseAddTransactionModal();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error instanceof Error ? error.message : 'Erro ao adicionar transação');
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

  if (error) {
    return (
      <PageWrapper>
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error}</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navigation />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-medium text-gray-900">Contas Bancárias</h2>
          <Button 
            size="sm" 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>

        {accounts.length === 0 ? (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-[200px] space-y-4">
              <p className="text-gray-600">Você ainda não possui contas cadastradas</p>
              <Button 
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Conta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card 
                key={account.id} 
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  setSelectedAccountId(account.id);
                  setIsAddTransactionModalOpen(true);
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    {account.name}
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-light text-gray-900">
                    {formatCurrency(account.balance)}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-500">Banco:</span>
                      <span className="ml-2 text-gray-900">{account.bank}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Agência:</span>
                      <span className="ml-2 text-gray-900">{account.agency}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Conta:</span>
                      <span className="ml-2 text-gray-900">{account.number}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={handleCloseAddTransactionModal}
          onAdd={handleAddTransaction}
          accountId={selectedAccountId}
        />

        <AddAccountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddAccount}
        />
      </div>
    </PageWrapper>
  );
} 