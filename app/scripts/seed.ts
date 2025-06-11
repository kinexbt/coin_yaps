
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

const sampleTokens = [
  {
    symbol: 'NYLA',
    name: 'NYLA Token',
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    network: 'solana',
    price: 0.0443,
    marketCap: 44300000,
    volume24h: 2500000,
    priceChange24h: 15.5,
    supply: 1000000000,
    liquidity: 500000,
    bCurve: 90.1,
    image: 'https://example.com/nyla.png',
  },
  {
    symbol: 'PEPE',
    name: 'Pepe Token',
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
    network: 'bsc',
    price: 0.00001234,
    marketCap: 12340000,
    volume24h: 850000,
    priceChange24h: -8.2,
    supply: 1000000000000,
    liquidity: 200000,
    bCurve: 75.3,
  },
  {
    symbol: 'BONK',
    name: 'Bonk Token',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    network: 'solana',
    price: 0.0000045,
    marketCap: 450000,
    volume24h: 120000,
    priceChange24h: 12.8,
    supply: 100000000000,
    liquidity: 80000,
    bCurve: 45.7,
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.prediction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.token.deleteMany();

  // Create sample tokens
  for (const tokenData of sampleTokens) {
    const token = await prisma.token.create({
      data: tokenData,
    });
    console.log(`✅ Created token: ${token.symbol}`);
  }

  console.log('🎉 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });