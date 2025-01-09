"use server";

import Decimal from "decimal.js";
import { getTotalIncomes } from "./incomesServices";
import { getTotalExpenses } from "./expensesServices";
import prisma from "@/lib/prisma";

export async function getAcademicsHonorarium(courseId: number) {
  const totalIncomes = new Decimal(await getTotalIncomes(courseId));
  const totalExpenses = await getTotalExpenses(courseId);
  const total = totalIncomes.minus(totalExpenses);

  const distribution = await prisma.distribution.findFirst({
    where: { course_fk: courseId, name: "Honorarios académicos" },
  });

  if (!distribution) {
    return "0";
  }

  const amount = new Decimal(distribution.percentage ?? 0)
    .div(100)
    .times(total)
    .trunc();

  return amount.toString();
}

export async function getCourseHonorariums(courseId: number) {
  const honorariums = await prisma.honorarium.findMany({
    where: { course_fk: courseId },
    select: {
      id: true,
      hours: true,
      function: true,
      percentage: true,
      participation_fk: true,
      academic_fk: true,
      participation: {
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
        },
      },
    },
  });

  return honorariums.map((honorarium) => ({
    id: honorarium.id,
    hours: honorarium.hours,
    function: honorarium.function,
    percentage: honorarium.percentage.toString(),
    participation_fk: honorarium.participation_fk,
    academic: {
      academic_fk: honorarium.academic_fk,
      name: honorarium.participation?.academic.user.name,
    },
  }));
}

export type getCourseHonorariumsResponse = ReturnType<
  typeof getCourseHonorariums
>;
