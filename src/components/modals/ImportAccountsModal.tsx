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
import { Upload, ArrowRight } from "lucide-react";
import { CreateAccountDTO } from "@/types/account";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Papa from 'papaparse';

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

interface ImportAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (accounts: CreateAccountDTO[]) => Promise<void>;
}

type Step = 'upload' | 'mapping' | 'preview';

interface ColumnMapping {
  name: string;
  bank: string;
  currency: string;
  country: string;
  balance: string;
}

export function ImportAccountsModal({ isOpen, onClose, onImport }: ImportAccountsModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: '',
    bank: '',
    currency: '',
    country: '',
    balance: ''
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        complete: (results) => {
          setCsvHeaders(Object.keys(results.data[0] || {}));
          setCsvData(results.data);
          setStep('mapping');
        }
      });
    }
  };

  const handleMapping = () => {
    if (!columnMapping.name || !columnMapping.bank) {
      alert('Nome e Banco são campos obrigatórios');
      return;
    }
    setStep('preview');
  };

  const getMappedData = (): CreateAccountDTO[] => {
    return csvData
      .filter(row => row[columnMapping.name] && row[columnMapping.bank])
      .map(row => ({
        name: row[columnMapping.name].trim(),
        bank: row[columnMapping.bank].trim(),
        currency: (row[columnMapping.currency] || 'BRL').trim(),
        country: (row[columnMapping.country] || 'BR').trim(),
        balance: parseFloat(row[columnMapping.balance]) || 0
      }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const accounts = getMappedData();
      
      if (accounts.length === 0) {
        throw new Error('Nenhuma conta válida encontrada no arquivo');
      }

      await onImport(accounts);
      onClose();
      setSelectedFile(null);
      setStep('upload');
      setColumnMapping({
        name: '',
        bank: '',
        currency: '',
        country: '',
        balance: ''
      });
      
    } catch (error) {
      console.error('Error importing file:', error);
      alert(error instanceof Error ? error.message : 'Erro ao importar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtra headers vazios e adiciona um identificador único
  const getValidHeaders = () => {
    return csvHeaders
      .filter(header => header && header.trim())
      .map(header => ({
        value: header,
        label: header
      }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Importar Contas
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {step === 'upload' && 'Selecione um arquivo CSV para importar suas contas'}
            {step === 'mapping' && 'Mapeie as colunas do seu arquivo'}
            {step === 'preview' && 'Confirme os dados antes de importar'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                <p>O arquivo CSV deve conter as seguintes colunas:</p>
                <div className="mt-2 text-xs font-mono bg-gray-50 p-3 rounded border border-gray-200">
                  name,bank,currency,country,balance<br />
                  Conta Principal,Nubank,BRL,BR,1000.00<br />
                  Conta USA,Chase,USD,US,500.00
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label 
                  htmlFor="csv-upload"
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="p-3 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 transition-colors">
                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-600 group-hover:text-gray-700">
                    {selectedFile ? selectedFile.name : 'Clique para selecionar arquivo CSV'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Nome da Conta *
                  </label>
                  <Select
                    value={columnMapping.name}
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, name: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {getValidHeaders().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">
                    Banco *
                  </label>
                  <Select
                    value={columnMapping.bank}
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, bank: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      {getValidHeaders().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Moeda (opcional)
                  </label>
                  <Select
                    value={columnMapping.currency}
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Não mapear</SelectItem>
                      {getValidHeaders().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    País (opcional)
                  </label>
                  <Select
                    value={columnMapping.country}
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Não mapear</SelectItem>
                      {getValidHeaders().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Saldo (opcional)
                  </label>
                  <Select
                    value={columnMapping.balance}
                    onValueChange={(value) => setColumnMapping(prev => ({ ...prev, balance: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Selecione a coluna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none">Não mapear</SelectItem>
                      {getValidHeaders().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleMapping}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
                disabled={!columnMapping.name || !columnMapping.bank}
              >
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[400px] overflow-auto">
                  <div className="divide-y divide-gray-200">
                    {getMappedData().map((account, index) => (
                      <div 
                        key={index} 
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {account.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {account.bank}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium ${
                              account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: account.currency
                              }).format(account.balance)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {currencies.find(c => c.code === account.currency)?.name || account.currency}
                              {' • '}
                              {countries.find(c => c.code === account.country)?.name || account.country}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">
                  Total de contas a importar: <span className="font-medium text-gray-900">{getMappedData().length}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Saldo total: <span className="font-medium text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(
                      getMappedData().reduce((sum, account) => {
                        // Conversão simples para BRL (em produção, usar taxas de câmbio reais)
                        const rate = account.currency === 'USD' ? 5 : 
                                    account.currency === 'EUR' ? 6 : 
                                    account.currency === 'GBP' ? 7 : 1;
                        return sum + (account.balance * rate);
                      }, 0)
                    )}
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2">⏳</div>
                    Importando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar {getMappedData().length} contas
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 'upload') {
                onClose();
              } else {
                setStep(step === 'preview' ? 'mapping' : 'upload');
              }
            }}
            className="border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
          >
            {step === 'upload' ? 'Cancelar' : 'Voltar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 