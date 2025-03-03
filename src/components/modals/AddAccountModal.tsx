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

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accountData: CreateAccountDTO) => Promise<void>;
}

const currencies = [
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra Esterlina' },
];

const countries = [
  { code: 'BR', name: 'Brasil' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'PT', name: 'Portugal' },
];

export function AddAccountModal({ isOpen, onClose, onAdd }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    currency: 'BRL',
    country: 'BR',
    balance: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: CreateAccountDTO = {
      name: formData.name.trim(),
      bank: formData.bank.trim(),
      currency: formData.currency,
      country: formData.country,
      balance: parseFloat(formData.balance) || 0,
    };

    await onAdd(accountData);
    onClose();
    setFormData({
      name: '',
      bank: '',
      currency: 'BRL',
      country: 'BR',
      balance: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Nova Conta Bancária
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Nome da Conta</Label>
            <Input
              id="name"
              placeholder="Ex: Nubank Principal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank" className="text-gray-700">Banco</Label>
            <Input
              id="bank"
              placeholder="Ex: Nubank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-gray-700">Moeda</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Selecione a moeda" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem 
                    key={currency.code} 
                    value={currency.code}
                    className="text-gray-900"
                  >
                    {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-gray-700">País</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
            >
              <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                <SelectValue placeholder="Selecione o país" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem 
                    key={country.code} 
                    value={country.code}
                    className="text-gray-900"
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance" className="text-gray-700">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="Ex: 1000.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
            />
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