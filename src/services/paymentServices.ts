"use server";

import prisma from "@/lib/prisma";

export async function getResponsibleHonorariumPayments(honorariumId: number) {
  try {
    const payments = prisma.responsiblePayment.findMany({
      where: {
        responsible_honorarium_fk: honorariumId,
      },
      select: {
        id: true,
        amount: true,
        observation: true,
        payment_date: true,
        paid: true,
        next_payment_date: true,
      },
      orderBy: {
        payment_date: "asc",
      },
    });
    return payments;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAcademicHonorariumPayments(honorariumId: number) {
  try {
    const payments = prisma.academicPayment.findMany({
      where: {
        academic_honorarium_fk: honorariumId,
      },
      select: {
        id: true,
        amount: true,
        observation: true,
        payment_date: true,
        paid: true,
        next_payment_date: true,
      },
      orderBy: {
        payment_date: "asc",
      },
    });
    return payments;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAcademicPayment(id: number) {
  try {
    const payment = prisma.academicPayment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        amount: true,
        observation: true,
        payment_date: true,
        paid: true,
        next_payment_date: true,
      },
    });
    return payment;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getResponsiblePayment(id: number) {
  try {
    const payment = prisma.responsiblePayment.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        amount: true,
        observation: true,
        payment_date: true,
        paid: true,
        next_payment_date: true,
      },
    });
    return payment;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getAmountToPay(
  honorariumId: number,
  type: "academic" | "responsible"
) {
  try {
    switch (type) {
      case "academic":
        await prisma.academicHonorarium.findUnique({
          where: {
            id: honorariumId,
          },
          select: {},
        });
      case "responsible":
        const responsiblePayments = await prisma.responsiblePayment.findMany({
          where: {
            responsible_honorarium_fk: honorariumId,
          },
          select: {
            amount: true,
          },
        });
        return responsiblePayments.reduce(
          (acc, payment) => acc + payment.amount,
          0
        );
    }
  } catch (error) {
    console.error(error);
    return 0;
  }
}
