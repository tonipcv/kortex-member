import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CreateTransactionDTO } from '@/types/card';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transactions } = await req.json() as { transactions: CreateTransactionDTO[] };
    
    if (!transactions.length) {
      return NextResponse.json({ error: 'No transactions to import' }, { status: 400 });
    }

    const cardId = transactions[0].cardId;

    // Verifica se o cartão pertence ao usuário
    const card = await prisma.creditCard.findFirst({
      where: {
        id: cardId,
        user: {
          email: session.user.email
        }
      }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Cria todas as transações
    const createdTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const created = await prisma.creditCardTransaction.create({
          data: {
            cardId: transaction.cardId,
            description: transaction.description,
            amount: transaction.amount,
            date: new Date(transaction.date),
            installments: transaction.installments,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
          }
        });

        // Se for parcelado, cria as parcelas futuras
        if (transaction.installments !== '1/1') {
          const [currentInstallment, totalInstallments] = transaction.installments.split('/').map(Number);
          const installmentAmount = transaction.amount / totalInstallments;
          const baseDate = new Date(transaction.date);

          for (let i = 1; i < totalInstallments; i++) {
            const futureDate = new Date(baseDate);
            futureDate.setMonth(baseDate.getMonth() + i);

            await prisma.creditCardTransaction.create({
              data: {
                cardId: transaction.cardId,
                description: transaction.description,
                amount: installmentAmount,
                date: futureDate,
                installments: `${i + 1}/${totalInstallments}`,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt
              }
            });
          }
        }

        return created;
      })
    );

    // Atualiza os valores das faturas
    const allTransactions = await prisma.creditCardTransaction.findMany({
      where: { cardId }
    });

    const currentDate = new Date();
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    const currentBill = allTransactions
      .filter(t => new Date(t.date) < nextMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    const nextBill = allTransactions
      .filter(t => new Date(t.date) >= nextMonth)
      .reduce((sum, t) => sum + t.amount, 0);

    await prisma.creditCard.update({
      where: { id: cardId },
      data: {
        currentBill,
        nextBill
      }
    });

    return NextResponse.json({
      transactions: createdTransactions,
      currentBill,
      nextBill
    });
  } catch (error) {
    console.error('Error importing transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 