"use server";

import prisma from "@/lib/prisma";
import { incomesSchemaType } from "@/lib/zod";
import { revalidatePath } from "next/cache";

export async function recalculateFee(courseId: number) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { _count: { select: { enrolled: true } }, enroll_value: true },
  });

  if (!course) {
    return;
  }

  const total = course._count.enrolled * course.enroll_value;

  await prisma.income.upsert({
    where: {
      name_course_fk: { name: "Ingresos arancel", course_fk: courseId },
    },
    create: { course_fk: courseId, name: "Ingresos arancel", amount: total },
    update: { amount: total },
  });
}

export async function getCourseIncomes(courseId: number) {
  const incomes = await prisma.income.findMany({
    where: { course_fk: courseId },
    omit: { course_fk: true },
    orderBy: { order: "asc" },
  });

  return incomes;
}

export async function updateIncomes(data: incomesSchemaType, courseId: number) {
  try {
    await Promise.all(
      data.incomes.map((income) => {
        if (!income.name) return;
        return prisma.income.update({
          where: { id: income.id },
          data: { ...income },
        });
      })
    );

    revalidatePath(`/api/cursos/${courseId}/distribucion`);
    return { success: true, message: "Ingresos actualizados" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar los ingresos" };
  }
}

export async function getTotalIncomes(courseId: number) {
  const incomes = await prisma.income.findMany({
    where: { course_fk: courseId },
    select: { amount: true },
  });

  return incomes.reduce((acc, income) => acc + income.amount, 0);
}

export type getCourseIncomesResponse = ReturnType<typeof getCourseIncomes>;
