"use server";

import prisma from "@/lib/prisma";
import { PaymentSchemaType } from "@/lib/zod";
import { Actions } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { registerAction } from "./loggerServices";

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
    let isUpdate = true;
    if (data.id) {
      await prisma.academicPayment.update({
        where: {
          id: data.id,
        },
        data: {
          payment_date: data.payment_date,
          paid: data.paid,
          amount: data.amount,
          observation: data.observation ?? "",
        },
      });
    } else {
      isUpdate = false;
      await prisma.academicPayment.create({
        data: {
          payment_date: data.payment_date,
          paid: data.paid,
          amount: data.amount,
          academic_honorarium_fk: honorariumId,
          observation: data.observation ?? "",
        },
      });
    }

    const academic = await prisma.academicHonorarium.findUnique({
      where: {
        id: honorariumId,
      },
      select: {
        created_at: true,
        updated_at: true,
        honorarium: {
          select: {
            academic: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            course_fk: true,
          },
        },
      },
    });

    registerAction(
      isUpdate ? Actions.update : Actions.create,
      `Pago de ${academic!.honorarium.academic.user.name} ${
        isUpdate ? "actualizado" : "creado"
      }`
    );

    revalidatePath(`/cursos/detalles/${academic!.honorarium.course_fk}/pagos`);

    return {
      success: true,
      message: "Pago creado exitosamente",
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
    let isUpdate = true;
    if (data.id) {
      await prisma.responsiblePayment.update({
        where: {
          id: data.id,
        },
        data: {
          responsible_honorarium_fk: honorariumId,
          payment_date: data.payment_date,
          paid: data.paid,
          amount: data.amount,
          observation: data.observation ?? "",
        },
      });
    } else {
      isUpdate = false;
      await prisma.responsiblePayment.create({
        data: {
          payment_date: data.payment_date,
          paid: data.paid,
          amount: data.amount,
          responsible_honorarium_fk: honorariumId,
          observation: data.observation ?? "",
        },
      });
    }

    const responsible = await prisma.responsibleHonorarium.findUnique({
      where: {
        id: honorariumId,
      },
      select: {
        created_at: true,
        updated_at: true,
        honorarium: {
          select: {
            academic: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            course_fk: true,
          },
        },
      },
    });

    revalidatePath(
      `/cursos/detalles/${responsible!.honorarium.course_fk}/pagos`
    );
    registerAction(
      isUpdate ? Actions.update : Actions.create,
      `Pago de ${responsible!.honorarium.academic.user.name} ${
        isUpdate ? "actualizado" : "creado"
      }`
    );
    return {
      success: true,
      message: `Pago ${isUpdate ? "actualizado" : "creado"} exitosamente`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Error al actualizar o crear el pago`,
    };
  }
}

export async function getLastAcademicPaymentDateById(
  academic_honorarium_id: number
) {
  try {
    const lastPayment = await prisma.academicPayment.findFirst({
      where: {
        academic_honorarium_fk: academic_honorarium_id,
      },
      select: {
        payment_date: true,
      },
      orderBy: {
        payment_date: "desc",
      },
    });
    return lastPayment?.payment_date;
  } catch (error) {
    console.error(error);
    return null;
  }
}
