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
import { CreateCardDTO } from '@/types/card';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardData: CreateCardDTO) => void;
}

export function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastDigits: '',
    limit: '',
    dueDate: '',
    color: '#820AD1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar os dados antes de enviar
    if (formData.lastDigits.length !== 4 || isNaN(Number(formData.lastDigits))) {
      alert('Os últimos 4 dígitos devem ser números válidos');
      return;
    }

    const cardData: CreateCardDTO = {
      name: formData.name.trim(),
      lastDigits: formData.lastDigits,
      limit: parseFloat(formData.limit),
      dueDate: new Date(formData.dueDate),
      color: formData.color
    };

    onAdd(cardData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Adicionar Novo Cartão
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Nome do Cartão</Label>
            <Input
              id="name"
              placeholder="Ex: Nubank"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastDigits">Últimos 4 dígitos</Label>
            <Input
              id="lastDigits"
              placeholder="Ex: 1234"
              maxLength={4}
              value={formData.lastDigits}
              onChange={(e) => setFormData({ ...formData, lastDigits: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limite do Cartão</Label>
            <Input
              id="limit"
              type="number"
              placeholder="Ex: 5000"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Vencimento da Fatura</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-white border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor do Cartão</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-20 h-10 p-1 bg-white border-gray-200"
              />
              <div 
                className="flex-1 rounded-md"
                style={{ backgroundColor: formData.color }}
              />
            </div>
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
              Adicionar Cartão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 