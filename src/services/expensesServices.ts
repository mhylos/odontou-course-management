"use server";

import { MultiplyValues } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { ExpenseSchemaType, ExpensesSchemaType } from "@/lib/zod";
import { Actions, MultiplyWith } from "@prisma/client";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";
import { registerAction } from "./loggerServices";
import { getCourseName } from "./courseServices";

export async function getCourseExpenses(courseId: number) {
  const expenses = await prisma.expenses.findMany({
    where: { course_fk: courseId },
    orderBy: { created_at: "asc" },
    select: {
      id: true,
      name: true,
      type: true,
      multiply: true,
      multiplier: true,
      amount: true,
    },
  });

  return expenses.map((expense) => ({
    ...expense,
    multiplier: expense.multiplier.toString(),
  }));
}

export async function deleteExpense(expenseId: number) {
  try {
    const expense = await prisma.expenses.delete({
      where: { id: expenseId },
      select: { name: true, course: { select: { name: true } } },
    });

    registerAction(
      Actions.delete,
      `Gasto **${expense.name}** eliminado del curso **${expense.course.name}**`
    );
    return { success: true, message: "Gasto eliminado" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar el gasto" };
  }
}

export async function createOrUpdateExpenses(
  data: ExpensesSchemaType,
  courseId: number
) {
  try {
    const expenses = await Promise.all(
      data.expenses.map((expense) => {
        return prisma.expenses.upsert({
          where: {
            name_course_fk: { name: expense.name, course_fk: courseId },
          },
          update: {
            type: expense.type,
            multiply: expense.multiply,
            multiplier: new Decimal(expense.multiplier),
            amount: expense.amount,
          },
          create: {
            name: expense.name,
            type: expense.type,
            multiply: expense.multiply,
            multiplier: parseFloat(expense.multiplier),
            amount: expense.amount,
            course_fk: courseId,
          },
        });
      })
    );

    const courseName = await getCourseName(courseId);

    registerAction(
      Actions.update,
      `Gastos del curso **${courseName}** actualizados`
    );
    const message =
      expenses.length > 0 ? "Gasto(s) creado(s)" : "Gasto(s) actualizado(s)";
    revalidatePath(`/cursos/detalles/${courseId}/distribucion`);
    return { success: true, message: message };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al crear gasto(s)" };
  }
}

export async function getMultiplyValues(courseId: number) {
  const getEnrollIncome = async () => {
    return prisma.income.findUnique({
      where: {
        name_course_fk: { name: "Ingresos arancel", course_fk: courseId },
      },
      select: { amount: true },
    });
  };

  const getEnrolledCount = async () => {
    return prisma.enrolled.count({
      where: { course_fk: courseId },
    });
  };

  const getElearningHours = async () => {
    return prisma.course.findUnique({
      where: { id: courseId },
      select: { online_hours: true },
    });
  };

  const values = await Promise.all([
    getEnrollIncome(),
    getEnrolledCount(),
    getElearningHours(),
  ]);

  const enrollIncome = values[0];
  const enrolledCount = values[1];
  const elearningHours = values[2];

  const multiplyValues: MultiplyValues = {
    elearning_incomes:
      elearningHours?.online_hours.times(enrolledCount).toString() || "0",
    enroll_incomes: enrollIncome?.amount.toString() || "0",
    students_enrolled: enrolledCount.toString() || "0",
  };

  return multiplyValues;
}

export async function getTotalExpenses(courseId: number) {
  const expenses = await prisma.expenses.aggregate({
    where: { course_fk: courseId },
    _sum: { amount: true },
  });

  return expenses._sum.amount || "0";
}

export type getCourseExpensesResponse = ReturnType<typeof getCourseExpenses>;
