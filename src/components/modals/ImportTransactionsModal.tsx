'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImportTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export function ImportTransactionsModal({ 
  isOpen, 
  onClose, 
  onImport 
}: ImportTransactionsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      await onImport(selectedFile);
      onClose();
    } catch (error) {
      console.error('Error importing file:', error);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Importar Transações
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            O arquivo CSV deve conter as seguintes colunas:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instruções */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-medium text-gray-700">description</p>
                <p className="text-gray-500">Netflix, Supermercado</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">amount</p>
                <p className="text-gray-500">29.90, 150.00</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">date</p>
                <p className="text-gray-500">2024-03-20</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">category</p>
                <p className="text-gray-500">Streaming, Alimentação</p>
              </div>
            </div>
            <div className="pt-2 text-xs text-gray-500">
              <p>Exemplo:</p>
              <code className="block bg-white p-2 rounded border border-gray-200 mt-1">
                description,amount,date,category<br />
                Netflix,29.90,2024-03-20,Streaming<br />
                Supermercado,150.00,2024-03-21,Alimentação
              </code>
            </div>
          </div>

          {/* Upload Area */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label 
                htmlFor="csv-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Clique para selecionar arquivo CSV'}
                </span>
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gray-900 text-white hover:bg-gray-800"
                disabled={!selectedFile || isLoading}
              >
                {isLoading ? 'Importando...' : 'Importar'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 