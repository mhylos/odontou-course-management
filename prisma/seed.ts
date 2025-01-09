import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_HIERARCHY_TYPES,
  DEFAULT_PAYMENT_TYPES,
  DEFAULT_PROGRAMS,
} from "@/lib/constants";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const paymentTypes = await prisma.paymentTypes.createMany({
    data: DEFAULT_PAYMENT_TYPES.map((name) => ({ name })),
  });
  const programs = await prisma.program.createMany({
    data: DEFAULT_PROGRAMS.map((name) => ({ name })),
  });
  const hierarchyTypes = await prisma.hierarchyTypes.createMany({
    data: DEFAULT_HIERARCHY_TYPES.map((name) => ({ name })),
  });
  const departments = await prisma.department.createMany({
    data: DEFAULT_DEPARTMENTS.map((name) => ({ name })),
  });

  console.log({
    paymentTypes,
    programs,
    hierarchyTypes,
    departments,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
