"use server";

import prisma from "@/lib/prisma";
import { IncomesSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";
import { registerAction } from "./loggerServices";
import { Actions } from "@prisma/client";

export async function recalculateFee(courseId: number) {
  const course = await prisma.course.findFirst({
    where: { id: courseId },
    select: { enroll_value: true, name: true },
  });

  const total = await prisma.enrolled.findMany({
    where: { course_fk: courseId },
    select: { discount: true },
  });

  if (!course) {
    return;
  }

  const totalDiscounted = total
    .reduce((acc, student) => {
      return acc.plus(
        course.enroll_value -
          Decimal.div(student.discount, 100)
            .times(course.enroll_value)
            .floor()
            .toNumber()
      );
    }, new Decimal(0))
    .ceil()
    .toNumber();

  await prisma.income.upsert({
    where: {
      name_course_fk: { name: "Ingresos arancel", course_fk: courseId },
    },
    create: {
      course_fk: courseId,
      name: "Ingresos arancel",
      amount: totalDiscounted,
    },
    update: { amount: totalDiscounted },
  });

  registerAction(
    Actions.update,
    `Ingresos de arancel del curso **${course.name}** recalculados`
  );
}

export async function getCourseIncomes(courseId: number) {
  const incomes = await prisma.income.findMany({
    where: { course_fk: courseId },
    omit: { course_fk: true },
    orderBy: { order: "asc" },
  });

  return incomes;
}

export async function updateIncomes(data: IncomesSchemaType, courseId: number) {
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

    const course = await prisma.course.findFirst({
      where: { id: courseId },
      select: { name: true },
    });
    registerAction(
      Actions.update,
      `Ingresos del curso **${course?.name}** actualizados`
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
