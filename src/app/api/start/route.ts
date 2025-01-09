import {
  DEFAULT_HIERARCHY_TYPES,
  DEFAULT_PAYMENT_TYPES,
  DEFAULT_PROGRAMS,
} from "@/lib/constants";
import prisma from "@/lib/prisma";

export async function GET() {
  const response = [];
  const programs = await prisma.program.findMany();
  const paymentTypes = await prisma.paymentTypes.findMany();
  const hierarchyTypes = await prisma.hierarchyTypes.findMany();
  if (programs.length === 0) {
    await prisma.program.createMany({
      data: DEFAULT_PROGRAMS.map((name) => ({ name })),
    });

    response.push("Programas por defecto creados");
  }

  if (paymentTypes.length === 0) {
    await prisma.paymentTypes.createMany({
      data: DEFAULT_PAYMENT_TYPES.map((name) => ({ name })),
    });

    response.push("Tipos de pago por defecto creados");
  }

  if (hierarchyTypes.length === 0) {
    await prisma.hierarchyTypes.createMany({
      data: DEFAULT_HIERARCHY_TYPES.map((name) => ({ name })),
    });

    response.push("Tipos de jerarquía por defecto creados");
  }

  return Response.json({ message: response });
}
