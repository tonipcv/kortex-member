import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { BankTransactionDTO } from '@/types/transaction';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data: BankTransactionDTO = await req.json();
    
    // Verifica se a conta pertence ao usuário
    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id: data.bankAccountId,
        user: {
          email: session.user.email
        }
      }
    });

    if (!bankAccount) {
      return new NextResponse(
        JSON.stringify({ error: 'Bank account not found' }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Cria a transação e atualiza o saldo da conta
    const [transaction] = await prisma.$transaction([
      // Cria a transação
      prisma.bankTransaction.create({
        data: {
          type: data.type,
          description: data.description,
          amount: data.amount,
          date: new Date(data.date),
          category: data.category,
          bankAccountId: data.bankAccountId,
        }
      }),
      // Atualiza o saldo da conta
      prisma.bankAccount.update({
        where: { id: data.bankAccountId },
        data: {
          balance: {
            [data.type === 'income' ? 'increment' : 'decrement']: data.amount
          }
        }
      })
    ]);

    return new NextResponse(
      JSON.stringify({ data: transaction }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 