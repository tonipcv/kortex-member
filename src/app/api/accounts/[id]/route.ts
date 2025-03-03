import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Verifica se a conta pertence ao usuário
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!existingAccount) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const data = await req.json();
    
    const account = await prisma.bankAccount.update({
      where: { id: params.id },
      data: {
        name: data.name,
        bank: data.bank,
        currency: data.currency,
        country: data.country,
        balance: data.balance,
        userId: user.id // Garante que a conta continua pertencendo ao mesmo usuário
      }
    });

    return NextResponse.json({ data: account });

  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 