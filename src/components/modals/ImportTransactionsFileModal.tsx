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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import Papa from 'papaparse';

interface ImportTransactionsFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (transactions: CreateTransactionDTO[]) => void;
}

interface CSVRow {
  description: string;
  amount: string;
  date: string;
  type: string;
  category: string;
}

interface CreateTransactionDTO {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export function ImportTransactionsFileModal({ isOpen, onClose, onImport }: ImportTransactionsFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== 'text/csv') {
      setError('Por favor, selecione um arquivo CSV válido');
      return;
    }

    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Erro ao processar o arquivo CSV');
          return;
        }

        const headers = results.data[0] as string[];
        const requiredHeaders = ['description', 'amount', 'date', 'type', 'category'];
        
        if (!requiredHeaders.every(header => headers.includes(header))) {
          setError('O arquivo CSV deve conter as colunas: descrição, valor, data, tipo e categoria');
          return;
        }

        const rows = results.data.slice(1) as string[][];
        const parsedRows = rows.map(row => ({
          description: row[headers.indexOf('description')],
          amount: row[headers.indexOf('amount')],
          date: row[headers.indexOf('date')],
          type: row[headers.indexOf('type')],
          category: row[headers.indexOf('category')]
        }));

        setPreview(parsedRows);
      },
      header: true,
      skipEmptyLines: true
    });
  };

  const handleImport = () => {
    if (!preview.length) {
      setError('Nenhuma transação para importar');
      return;
    }

    const transactions: CreateTransactionDTO[] = preview.map(row => ({
      type: row.type.toLowerCase() as 'income' | 'expense',
      description: row.description.trim(),
      amount: parseFloat(row.amount.replace(',', '.')),
      date: new Date(row.date),
      category: row.category
    }));

    onImport(transactions);
    onClose();
    setFile(null);
    setPreview([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Importar Transações
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Arquivo CSV</Label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="bg-white border-gray-200"
            />
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-base mb-3">Formato esperado do arquivo CSV</p>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {/* Colunas Requeridas */}
                <div>
                  <p className="font-medium mb-2">Colunas requeridas:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">description</p>
                      <p className="text-gray-600">Descrição da transação</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">amount</p>
                      <p className="text-gray-600">Valor (ex: 29.90 ou 29,90)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">date</p>
                      <p className="text-gray-600">Data (AAAA-MM-DD)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">type</p>
                      <p className="text-gray-600">income (receita) ou expense (despesa)</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">category</p>
                      <p className="text-gray-600">Categoria da transação</p>
                    </div>
                  </div>
                </div>

                {/* Exemplo */}
                <div>
                  <p className="font-medium mb-2">Exemplo de arquivo:</p>
                  <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm">
                    <p className="text-gray-900 border-b border-gray-200 pb-2">
                      description,amount,date,type,category
                    </p>
                    <div className="pt-2 space-y-1 text-gray-600">
                      <p>Salário,5000.00,2024-02-18,income,Salário</p>
                      <p>Aluguel,1500.00,2024-02-18,expense,Moradia</p>
                      <p>Internet,150.00,2024-02-19,expense,Serviços</p>
                    </div>
                  </div>
                </div>

                {/* Categorias Sugeridas */}
                <div>
                  <p className="font-medium mb-2">Categorias sugeridas:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-emerald-600">Receitas (income)</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Salário</li>
                        <li>Freelance</li>
                        <li>Investimentos</li>
                        <li>Outros</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Despesas (expense)</p>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Alimentação</li>
                        <li>Moradia</li>
                        <li>Transporte</li>
                        <li>Saúde</li>
                        <li>Educação</li>
                        <li>Lazer</li>
                        <li>Serviços</li>
                        <li>Outros</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <span className="font-medium">Importante:</span> A primeira linha deve conter os nomes das colunas exatamente como mostrado acima.
                Certifique-se de que seu arquivo esteja no formato CSV e use vírgulas como separador.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && (
            <div className="space-y-2">
              <Label>Pré-visualização ({preview.length} transações)</Label>
              <div className="max-h-60 overflow-auto rounded-md border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Descrição</th>
                      <th className="p-2 text-left">Valor</th>
                      <th className="p-2 text-left">Data</th>
                      <th className="p-2 text-left">Tipo</th>
                      <th className="p-2 text-left">Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-2">{row.description}</td>
                        <td className="p-2">R$ {row.amount}</td>
                        <td className="p-2">{new Date(row.date).toLocaleDateString('pt-BR')}</td>
                        <td className="p-2">{row.type === 'income' ? 'Receita' : 'Despesa'}</td>
                        <td className="p-2">{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
            type="button"
            onClick={handleImport}
            className="bg-gray-900 text-white hover:bg-gray-800"
            disabled={!preview.length}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar {preview.length} Transações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 