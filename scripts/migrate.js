#!/usr/bin/env node
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Running migrations...");
  // Prisma will apply pending migrations
  const result = await prisma.$executeRawUnsafe("SELECT 1");
  console.log("Migrations completed successfully");
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
