// const { PrismaClient } = require("@prisma/client");
import client from "@prisma/client";
const { PrismaClient } = client;

const prisma = new PrismaClient();

// async function main() {
//   // ... you will write your Prisma Client queries here
// }

// main()
//   .catch((e) => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })

export default prisma;
