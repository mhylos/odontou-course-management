"use server";

import prisma from "@/lib/prisma";
import { expenseSchemaType, expensesSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";

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
    },
  });

  return expenses;
}

export async function deleteExpense(expenseId: number) {
  try {
    await prisma.expenses.delete({
      where: { id: expenseId },
    });

    return { success: true, message: "Gasto eliminado" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al eliminar el gasto" };
  }
}

export async function createOrUpdateExpenses(
  data: expensesSchemaType,
  courseId: number
) {
  try {
    const updatedExpenses: expensesSchemaType["expenses"] = [];
    const newExpenses: expensesSchemaType["expenses"] = [];

    data.expenses.map((expense) => {
      if (!expense.id) {
        newExpenses.push(expense);
      } else {
        updatedExpenses.push(expense);
      }
    });

    console.log("update:", updatedExpenses, "new:", newExpenses);
    await Promise.all(
      updatedExpenses.map((expense) => {
        if (!expense) return;
        return prisma.expenses.update({
          where: { id: expense.id },
          data: {
            name: expense.name,
            type: expense.type,
            multiply: expense.multiply,
            multiplier: parseFloat(expense.multiplier),
          },
        });
      })
    );
    const expenses = await prisma.expenses.createMany({
      data: newExpenses.map((expense) => ({
        ...expense,
        multiplier: parseFloat(expense.multiplier),
        course_fk: courseId,
      })),
    });
    const message =
      expenses.count > 0 ? "Gasto(s) creado(s)" : "Gasto(s) actualizado(s)";
    revalidatePath(`/cursos/detalles/${courseId}/distribucion`);
    return { success: true, message: message };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al crear gasto(s)" };
  }
}

export async function getTotalExpenses(courseId: number) {
  const expenses = await prisma.expenses.findMany({
    where: { course_fk: courseId },
    select: {
      multiplier: true,
      multiply: true,
      type: true,
      course: {
        select: { enroll_value: true, _count: { select: { enrolled: true } } },
      },
    },
  });

  if (expenses.length === 0) {
    return "0";
  }

  const enrolledCount = expenses[0].course._count.enrolled;
  const enrollValue = expenses[0].course.enroll_value;

  return expenses
    .reduce((acc, expense) => {
      const value = expense.multiplier
        .dividedBy(expense.type === "percentage" ? 100 : 1)
        .times(
          expense.multiply === "enroll_value" ? enrollValue : enrolledCount
        );
      return acc.plus(value.toNumber());
    }, new Decimal(0))
    .toString();
}

export type getCourseExpensesResponse = ReturnType<typeof getCourseExpenses>;
