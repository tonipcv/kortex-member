import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    // Tenta conectar ao banco
    await prisma.$connect();
    console.log('Database connection successful');

    // Tenta buscar um usuário
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);

  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 