import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário de teste
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Criar conta bancária de teste
  await prisma.bankAccount.create({
    data: {
      userId: user.id,
      name: 'Nubank',
      bank: 'Nu Pagamentos S.A.',
      agency: '0001',
      number: '123456-7',
      balance: 1000,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 