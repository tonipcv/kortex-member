'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  BankTransactionDTO,
  CreditCardTransactionDTO,
} from "@/types/transaction";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transactionData: BankTransactionDTO) => Promise<void>;
  accountId?: string;
}

interface CreateTransactionDTO {
  cardId: string;
  description: string;
  amount: number;
  date: Date;
  installments: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categories = {
  income: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Outros',
  ],
  expense: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Outros',
  ]
};

export function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  accountId 
}: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    date: new Date(),
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId) return;

    const transaction: BankTransactionDTO = {
      type: formData.type as 'income' | 'expense',
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      bankAccountId: accountId,
    };

    await onAdd(transaction);
    onClose();
    setFormData({
      type: 'expense',
      description: '',
      amount: '',
      date: new Date(),
      category: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Novo Lançamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-700">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value, category: '' })}
            >
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Despesa</SelectItem>
                <SelectItem value="income">Receita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Compras do mês"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Ex: 99.90"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date.toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type as keyof typeof categories].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 