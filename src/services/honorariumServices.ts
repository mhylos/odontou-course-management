"use server";

import Decimal from "decimal.js";
import { getTotalIncomes } from "./incomesServices";
import { getTotalExpenses } from "./expensesServices";
import prisma from "@/lib/prisma";
import { AcademicFunctions, ResponsibleFunctions } from "@prisma/client";
import {
  AcademicHonorariumSchemaType,
  ResponsibleHonorariumSchemaType,
} from "@/lib/zod";

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

export async function getAcademicsHonorariumsByCourse(
  courseId: number
): Promise<AcademicHonorariumSchemaType[]> {
  const academicsHonorariums = await prisma.academicHonorarium.findMany({
    where: {
      honorarium: {
        course_fk: courseId,
      },
    },
    select: {
      id: true,
      function: true,
      hours: true,
      honorarium: {
        select: {
          academic: {
            select: {
              user: {
                select: {
                  name: true,
                  rut: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return academicsHonorariums.map((academic) => ({
    id: academic.id,
    function: academic.function,
    academic_fk: academic.honorarium.academic.user.rut,
    academic_name: academic.honorarium.academic.user.name ?? "",
    hours: academic.hours.toString(),
  }));
}

export async function getResponsiblesHonorariumsByCourse(
  courseId: number
): Promise<ResponsibleHonorariumSchemaType[]> {
  const responsibleHonorariums = await prisma.responsibleHonorarium.findMany({
    where: {
      honorarium: {
        course_fk: courseId,
      },
    },
    select: {
      id: true,
      function: true,
      percentage: true,
      honorarium: {
        select: {
          academic: {
            select: {
              user: {
                select: {
                  name: true,
                  rut: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return responsibleHonorariums.map((responsible) => ({
    id: responsible.id,
    function: responsible.function,
    academic_name: responsible.honorarium.academic.user.name ?? "",
    percentage: responsible.percentage.toString(),
  }));
}

export async function upsertResponsiblesHonorariums(
  courseId: number,
  responsible: {
    rut: number;
    percentage?: Decimal;
    function: ResponsibleFunctions;
  }
) {
  const honorarium = await prisma.honorarium.upsert({
    where: {
      course_fk_academic_fk: {
        course_fk: courseId,
        academic_fk: responsible.rut,
      },
    },
    update: {},
    create: {
      course_fk: courseId,
      academic_fk: responsible.rut,
    },
  });

  const updatedHonorarium = await prisma.responsibleHonorarium.upsert({
    where: {
      honorarium_fk_function: {
        honorarium_fk: honorarium.id,
        function: responsible.function,
      },
    },
    update: {
      ...(responsible.percentage ? { percentage: responsible.percentage } : {}),
    },
    create: {
      honorarium_fk: honorarium.id,
      percentage: responsible.percentage,
      function: responsible.function,
    },
  });

  return updatedHonorarium;
}

export async function upsertAcademicsHonorariums(
  courseId: number,
  participation_fk: number,
  academic: {
    rut: number;
    hours: Decimal;
    function: AcademicFunctions;
  }
) {
  const honorarium = await prisma.honorarium.upsert({
    where: {
      course_fk_academic_fk: {
        course_fk: courseId,
        academic_fk: academic.rut,
      },
    },
    update: {},
    create: {
      course_fk: courseId,
      academic_fk: academic.rut,
    },
  });

  const updatedHonorarium = await prisma.academicHonorarium.upsert({
    where: {
      honorarium_fk_participation_fk_function: {
        function: academic.function,
        honorarium_fk: honorarium.id,
        participation_fk,
      },
    },
    update: {
      hours: academic.hours,
    },
    create: {
      honorarium_fk: honorarium.id,
      participation_fk,
      hours: academic.hours,
      function: academic.function,
    },
  });

  return updatedHonorarium;
}

export type ResponsiblesHonorariumsResponse = ReturnType<
  typeof getResponsiblesHonorariumsByCourse
>;

export type AcademicsHonorariumsResponse = ReturnType<
  typeof getAcademicsHonorariumsByCourse
>;
