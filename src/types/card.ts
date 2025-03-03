export interface CreditCard {
  id: string;
  userId: string;
  name: string;
  lastDigits: string;
  currentBill: number;
  nextBill: number;
  dueDate: Date;
  limit: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  transactions?: CreditCardTransaction[];
  bills?: CreditCardBill[];
}

export interface CreditCardTransaction {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  date: Date;
  installments: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditCardBill {
  id: string;
  cardId: string;
  dueDate: Date;
  amount: number;
  paid: boolean;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDTO {
  name: string;
  lastDigits: string;
  limit: number;
  dueDate: Date;
  color: string;
}

export interface CreateTransactionDTO {
  cardId: string;
  description: string;
  amount: number;
  date: Date;
  installments: string;
  createdAt?: Date;
  updatedAt?: Date;
} 