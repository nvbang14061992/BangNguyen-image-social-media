import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

try {
  await prisma.$executeRaw`SELECT 1+1 AS result`;
  console.log("[Prisma]: \tConnected successfully!!!");
} catch (error) {
  console.log("[Prisma]: \tConnected failed!!!");
  console.log(error);
}

export default prisma;