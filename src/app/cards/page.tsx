'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Receipt, Calendar, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/PageWrapper";
import { CreditCard as ICreditCard, CreditCardTransaction, CreateCardDTO, CreateTransactionDTO } from '@/types/card';
import { AddCardModal } from "@/components/modals/AddCardModal";
import { useRouter } from 'next/navigation';
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";
import { ImportTransactionsModal } from "@/components/modals/ImportTransactionsModal";
import Navigation from "@/components/Navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export default function CardsPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });
  const [cards, setCards] = useState<ICreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCards();
    }
  }, [status]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/cards');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cartões');
      }

      const data = await response.json();
      
      // Garantir que data é um array
      if (Array.isArray(data)) {
        setCards(data);
      } else if (data.error) {
        setError(data.error);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      setError('Erro ao carregar cartões');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardData: CreateCardDTO) => {
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar cartão');
      }

      const newCard = await response.json();
      setCards([...cards, newCard]);
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Erro ao adicionar cartão. Tente novamente.');
    }
  };

  const handleUpdateCard = async (id: string, cardData: Partial<ICreditCard>) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });
      const updatedCard = await response.json();
      setCards(cards.map(card => card.id === id ? updatedCard : card));
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await fetch(`/api/cards/${id}`, {
        method: 'DELETE'
      });
      setCards(cards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddTransaction = async (transactionData: CreateTransactionDTO) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar transação');
      }

      const newTransaction = await response.json();
      
      // Atualiza o cartão com a nova transação
      setCards(cards.map(card => {
        if (card.id === transactionData.cardId) {
          return {
            ...card,
            transactions: [...(card.transactions || []), newTransaction],
            currentBill: card.currentBill + newTransaction.amount
          };
        }
        return card;
      }));
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Erro ao adicionar transação. Tente novamente.');
    }
  };

  const handleOpenAddTransactionModal = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsAddTransactionModalOpen(true);
  };

  const handleCloseAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
    setSelectedCardId(null);
  };

  const handleImportTransactions = async (transactions: CreateTransactionDTO[]) => {
    try {
      const response = await fetch('/api/transactions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions })
      });

      if (!response.ok) {
        throw new Error('Erro ao importar transações');
      }

      const result = await response.json();
      
      // Atualiza o cartão com as novas transações
      setCards(cards.map(card => {
        if (card.id === selectedCardId) {
          return {
            ...card,
            transactions: [...(card.transactions || []), ...result.transactions],
            currentBill: result.currentBill,
            nextBill: result.nextBill
          };
        }
        return card;
      }));

      alert(`${result.transactions.length} transações importadas com sucesso!`);
    } catch (error) {
      console.error('Error importing transactions:', error);
      alert('Erro ao importar transações. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-slate-50">Carregando...</div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-400">{error}</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navigation />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-medium text-gray-900">Cartões de Crédito</h2>
          <Button 
            size="sm" 
            onClick={handleOpenAddModal}
            className="bg-gray-900 text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cartão
          </Button>
        </div>

        {cards.length === 0 ? (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center h-[200px] space-y-4">
              <p className="text-gray-600">Você ainda não possui cartões cadastrados</p>
              <Button 
                size="sm" 
                onClick={handleOpenAddModal}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cartão
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue={cards[0]?.id.toString()} className="space-y-4">
            <TabsList className="w-full bg-white border border-gray-200 shadow-sm p-1">
              {cards.map((card) => (
                <TabsTrigger
                  key={card.id}
                  value={card.id.toString()}
                  className="text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  {card.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {cards.map((card) => (
              <TabsContent key={card.id} value={card.id.toString()} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Fatura Atual */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">
                        Fatura Atual
                      </CardTitle>
                      <Receipt className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-light text-gray-900">
                        {formatCurrency(card.currentBill)}
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="text-gray-500">
                          Vencimento: {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Próxima Fatura */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">
                        Próxima Fatura
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-light text-gray-900">
                        {formatCurrency(card.nextBill)}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        Limite disponível: {formatCurrency(card.limit - card.currentBill - card.nextBill)}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informações do Cartão */}
                  <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-900">
                        Informações do Cartão
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Final:</span>
                          <span className="ml-2 text-gray-900">•••• {card.lastDigits}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Limite Total:</span>
                          <span className="ml-2 text-gray-900">{formatCurrency(card.limit)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Vencimento:</span>
                          <span className="ml-2 text-gray-900">Todo dia {new Date(card.dueDate).getDate()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Transações */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="font-medium text-gray-900">Transações da Fatura Atual</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm"
                          className="bg-gray-900 text-white hover:bg-gray-800"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border border-gray-200">
                        <DropdownMenuItem 
                          onClick={() => handleOpenAddTransactionModal(card.id)}
                          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Transação
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedCardId(card.id);
                            setIsImportModalOpen(true);
                          }}
                          className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Importar CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {card.transactions?.map((transaction: CreditCardTransaction) => (
                        <div 
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              Parcela {transaction.installments}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {formatCurrency(transaction.amount)}
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
              </TabsContent>
            ))}
          </Tabs>
        )}

        <AddCardModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          onAdd={handleAddCard}
        />

        {selectedCardId && (
          <AddTransactionModal
            isOpen={isAddTransactionModalOpen}
            onClose={handleCloseAddTransactionModal}
            onAdd={handleAddTransaction}
            cardId={selectedCardId}
          />
        )}

        {selectedCardId && (
          <ImportTransactionsModal
            isOpen={isImportModalOpen}
            onClose={() => {
              setIsImportModalOpen(false);
              setSelectedCardId(null);
            }}
            onImport={handleImportTransactions}
            cardId={selectedCardId}
          />
        )}
      </div>
    </PageWrapper>
  );
} 