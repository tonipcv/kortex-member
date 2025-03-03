export interface BaseTransactionDTO {
  description: string;
  amount: number;
  date: Date;
  category: string;
}

export interface BankTransactionDTO extends BaseTransactionDTO {
  type: 'income' | 'expense';
  bankAccountId: string;
}

export interface CreditCardTransactionDTO extends BaseTransactionDTO {
  creditCardId: string;
  installments: number;
}

export type CreateTransactionDTO = BankTransactionDTO | CreditCardTransactionDTO; 