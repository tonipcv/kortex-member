export interface BankAccount {
  id: string;
  userId: string;
  name: string;
  bank: string;
  currency: string;
  country: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDTO {
  name: string;
  bank: string;
  currency: string;
  country: string;
  balance?: number;
} 