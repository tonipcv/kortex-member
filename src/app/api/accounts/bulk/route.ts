import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { CreateAccountDTO } from '@/types/account';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { accounts } = await req.json() as { accounts: CreateAccountDTO[] };
    
    const createdAccounts = await prisma.$transaction(
      accounts.map(account => 
        prisma.bankAccount.create({
          data: {
            userId: user.id,
            name: account.name,
            bank: account.bank,
            currency: account.currency,
            country: account.country,
            balance: account.balance || 0
          }
        })
      )
    );

    return NextResponse.json({ data: createdAccounts }, { status: 201 });

  } catch (error) {
    console.error('Error importing accounts:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 