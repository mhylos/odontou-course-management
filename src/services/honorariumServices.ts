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
  const academicsHonorariums = await prisma.honorarium.findMany({
    where: {
      course_fk: courseId,
      academic_honorarium: { some: {} },
    },
    select: {
      id: true,
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
      academic_honorarium: {
        select: {
          id: true,
          function: true,
          hours: true,
        },
      },
    },
  });

  return academicsHonorariums.map((honorarium) => ({
    id: honorarium.id,
    academic_rut: honorarium.academic.user.rut,
    academic_name: honorarium.academic.user.name ?? "",
    functions: honorarium.academic_honorarium.map((honorarium) => ({
      academic_honorarium_id: honorarium.id,
      function: honorarium.function,
      hours: honorarium.hours.toString(),
    })),
  }));
}

export async function getResponsiblesHonorariumsByCourse(
  courseId: number
): Promise<ResponsibleHonorariumSchemaType[]> {
  const responsibles = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      coordinator: { select: { rut: true, name: true } },
      course_director: { select: { rut: true, name: true } },
    },
  });

  if (!responsibles) return [];

  const getLatestResponsible = async (
    rut: number,
    func: ResponsibleFunctions
  ) => {
    const responsible = await prisma.responsibleHonorarium.findFirst({
      where: {
        honorarium: {
          course_fk: courseId,
          academic_fk: rut,
        },
        AND: { function: { equals: func } },
      },
      select: {
        honorarium: {
          select: {
            academic: {
              select: { user: { select: { name: true } } },
            },
          },
        },
        id: true,
        function: true,
        percentage: true,
      },
    });

    return responsible;
  };

  const coordinator = await getLatestResponsible(
    responsibles.coordinator.rut,
    ResponsibleFunctions.coordinator
  );
  const courseDirector = await getLatestResponsible(
    responsibles.course_director.rut,
    ResponsibleFunctions.director
  );

  return [coordinator, courseDirector]
    .map((responsible) => {
      if (!responsible) return null;
      return {
        id: responsible.id,
        academic_name: responsible.honorarium.academic.user.name ?? "",
        function: responsible.function,
        percentage: responsible.percentage.toString(),
      };
    })
    .filter((responsible) => responsible !== null);
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
