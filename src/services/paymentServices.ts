"use server";

import prisma from "@/lib/prisma";
import { PaymentSchemaType } from "@/lib/zod";

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

export async function upsertAcademicPayment(
  data: PaymentSchemaType,
  honorariumId: number
) {
  try {
    await prisma.academicPayment.upsert({
      where: {
        id: data.id ?? undefined,
      },
      update: {
        payment_date: data.payment_date,
        next_payment_date: data.next_payment_date,
        paid: data.paid,
        amount: data.amount,
        observation: data.observation ?? "",
      },
      create: {
        payment_date: data.payment_date,
        next_payment_date: data.next_payment_date,
        paid: data.paid,
        amount: data.amount,
        academic_honorarium_fk: honorariumId,
        observation: data.observation ?? "",
      },
    });
    return {
      success: true,
      message: "Pago creado",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear el pago",
    };
  }
}

export async function upsertResponsiblePayment(
  data: PaymentSchemaType,
  honorariumId: number
) {
  try {
    await prisma.responsiblePayment.upsert({
      where: {
        id: data.id ?? undefined,
      },
      update: {
        payment_date: data.payment_date,
        next_payment_date: data.next_payment_date,
        paid: data.paid,
        amount: data.amount,
        observation: data.observation ?? "",
      },
      create: {
        payment_date: data.payment_date,
        next_payment_date: data.next_payment_date,
        paid: data.paid,
        amount: data.amount,
        responsible_honorarium_fk: honorariumId,
        observation: data.observation ?? "",
      },
    });
    return {
      success: true,
      message: "Pago creado",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear el pago",
    };
  }
}
