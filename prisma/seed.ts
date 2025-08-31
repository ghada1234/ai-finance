import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default categories
  const defaultCategories = [
    { name: 'Food & Dining', color: '#FF6B6B', type: 'EXPENSE' as const },
    { name: 'Transportation', color: '#4ECDC4', type: 'EXPENSE' as const },
    { name: 'Shopping', color: '#45B7D1', type: 'EXPENSE' as const },
    { name: 'Entertainment', color: '#96CEB4', type: 'EXPENSE' as const },
    { name: 'Healthcare', color: '#FFEAA7', type: 'EXPENSE' as const },
    { name: 'Utilities', color: '#DDA0DD', type: 'EXPENSE' as const },
    { name: 'Housing', color: '#98D8C8', type: 'EXPENSE' as const },
    { name: 'Education', color: '#F7DC6F', type: 'EXPENSE' as const },
    { name: 'Salary', color: '#82E0AA', type: 'INCOME' as const },
    { name: 'Freelance', color: '#85C1E9', type: 'INCOME' as const },
    { name: 'Investment', color: '#F8C471', type: 'INCOME' as const },
    { name: 'Transfer', color: '#BB8FCE', type: 'TRANSFER' as const },
  ];

  // Clear existing categories and create new ones
  await prisma.category.deleteMany();
  
  for (const category of defaultCategories) {
    await prisma.category.create({
      data: {
        name: category.name,
        color: category.color,
        type: category.type,
        isDefault: true,
      },
    });
  }

  console.log('✅ Categories seeded successfully');

  // Create a test user (you can modify this for testing)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  console.log('✅ Test user created');

  // Create test accounts
  const testAccounts = [
    { name: 'Main Checking', type: 'CHECKING' as const, balance: 5000, color: '#3B82F6' },
    { name: 'Savings Account', type: 'SAVINGS' as const, balance: 15000, color: '#10B981' },
    { name: 'Credit Card', type: 'CREDIT_CARD' as const, balance: -500, color: '#8B5CF6' },
  ];

  // Clear existing accounts for test user
  await prisma.account.deleteMany({
    where: { userId: testUser.id },
  });

  for (const account of testAccounts) {
    await prisma.account.create({
      data: {
        name: account.name,
        type: account.type,
        balance: account.balance,
        color: account.color,
        userId: testUser.id,
        isDefault: account.name === 'Main Checking',
      },
    });
  }

  console.log('✅ Test accounts created');

  // Create some sample transactions
  const sampleTransactions = [
    { description: 'Grocery Shopping', amount: -85.50, type: 'EXPENSE' as const, categoryName: 'Food & Dining' },
    { description: 'Gas Station', amount: -45.00, type: 'EXPENSE' as const, categoryName: 'Transportation' },
    { description: 'Netflix Subscription', amount: -15.99, type: 'EXPENSE' as const, categoryName: 'Entertainment' },
    { description: 'Salary Deposit', amount: 4500.00, type: 'INCOME' as const, categoryName: 'Salary' },
    { description: 'Coffee Shop', amount: -4.50, type: 'EXPENSE' as const, categoryName: 'Food & Dining' },
    { description: 'Freelance Project', amount: 800.00, type: 'INCOME' as const, categoryName: 'Freelance' },
  ];

  const mainAccount = await prisma.account.findFirst({
    where: { userId: testUser.id, name: 'Main Checking' },
  });

  if (mainAccount) {
    // Clear existing transactions for test user
    await prisma.transaction.deleteMany({
      where: { userId: testUser.id },
    });

    for (const transaction of sampleTransactions) {
      const category = await prisma.category.findFirst({
        where: { name: transaction.categoryName },
      });

      await prisma.transaction.create({
        data: {
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          date: new Date(),
          userId: testUser.id,
          accountId: mainAccount.id,
          categoryId: category?.id,
        },
      });
    }
  }

  console.log('✅ Sample transactions created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
