"use server";

import prisma from "@/lib/prisma";
import { format } from "rutility";
import { Option } from "@/components/common/Dropdown";
import { CreateCourseSchemaType } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_COORDINATOR_PERCENTAGE,
  DEFAULT_DIRECTOR_PERCENTAGE,
  DISTRIBUTION_EXTERNAL_PERCENTAGE,
  DISTRIBUTION_INTERNAL_PERCENTAGE,
  DISTRIBUTION_TYPE_TOTAL,
  OVERHEAD_PERCENTAGE,
} from "@/lib/constants";
import {
  Actions,
  MultiplierTypes,
  MultiplyWith,
  ResponsibleFunctions,
} from "@prisma/client";
import Decimal from "decimal.js";
import { upsertResponsiblesHonorariums } from "./honorariumServices";
import { registerAction } from "./loggerServices";

export async function createCourse(data: CreateCourseSchemaType) {
  try {
    const program = await prisma.program.findUnique({
      where: {
        id: data.program_fk,
      },
    });

    const isElearning = program?.name === "E-Learning";

    const isExternal =
      program?.name === "Presencial externo" ||
      program?.name === "Semi-Presencial externo";

    const distributionPercentage = isExternal
      ? DISTRIBUTION_EXTERNAL_PERCENTAGE
      : DISTRIBUTION_INTERNAL_PERCENTAGE;

    const course = await prisma.course.create({
      data: {
        ...data,
        incomes: {
          create: [
            {
              name: "Ingresos arancel",
              amount: 0,
              order: 0,
            },
            {
              name: "Otros ingresos afectos a I.V.A",
              amount: 0,
              order: 1,
            },
            {
              name: "Otros ingresos no afectos a I.V.A",
              amount: 0,
              order: 2,
            },
            {
              name: "Otros",
              amount: 0,
              order: 3,
            },
          ],
        },
        expenses: {
          createMany: {
            data: [
              {
                name: "Overhead Universidad",
                multiplier: OVERHEAD_PERCENTAGE,
                type: MultiplierTypes.percentage,
                multiply: MultiplyWith.enroll_incomes,
              },
              ...(isElearning
                ? [
                    {
                      name: "Pago plataforma",
                      multiplier: 1,
                      type: MultiplierTypes.unit_cost,
                      multiply: MultiplyWith.elearning_incomes,
                    },
                  ]
                : []),
            ],
          },
        },
        distribution: {
          createMany: {
            data: [
              {
                name: "Departamento",
                percentage: new Decimal(100).minus(DISTRIBUTION_TYPE_TOTAL),
              },
              {
                name: "Honorarios académicos",
                percentage: distributionPercentage,
              },
              {
                name: "Facultad",
                percentage: new Decimal(DISTRIBUTION_TYPE_TOTAL).minus(
                  distributionPercentage
                ),
              },
            ],
          },
        },
      },
    });

    await upsertResponsiblesHonorariums(course.id, {
      function: ResponsibleFunctions.coordinator,
      percentage: new Decimal(DEFAULT_COORDINATOR_PERCENTAGE),
      rut: data.coordinator_fk,
    });

    await upsertResponsiblesHonorariums(course.id, {
      function: ResponsibleFunctions.director,
      percentage: new Decimal(DEFAULT_DIRECTOR_PERCENTAGE),
      rut: data.course_director_fk,
    });

    revalidatePath("/cursos");
    registerAction(Actions.create, `Curso **${data.name}** creado`);
    return { message: "Curso creado", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function updateCourse(id: number, data: CreateCourseSchemaType) {
  try {
    const program = await prisma.program.findUnique({
      where: {
        id: data.program_fk,
      },
    });

    const isElearning = program?.name === "E-Learning";
    const isExternal =
      program?.name === "Presencial externo" ||
      program?.name === "Semi-Presencial externo";

    const distributionPercentage = isExternal
      ? DISTRIBUTION_EXTERNAL_PERCENTAGE
      : DISTRIBUTION_INTERNAL_PERCENTAGE;

    await upsertResponsiblesHonorariums(id, {
      function: ResponsibleFunctions.coordinator,
      rut: data.coordinator_fk,
    });

    await upsertResponsiblesHonorariums(id, {
      function: ResponsibleFunctions.director,
      rut: data.course_director_fk,
    });

    const eLearningExists = await prisma.expenses.findFirst({
      where: {
        course_fk: id,
        name: "Pago plataforma",
      },
    });

    if (isElearning) {
      if (!eLearningExists) {
        await prisma.expenses.create({
          data: {
            course_fk: id,
            name: "Pago plataforma",
            multiplier: 1,
            type: MultiplierTypes.unit_cost,
            multiply: MultiplyWith.elearning_incomes,
          },
        });
      }
    } else {
      if (eLearningExists) {
        await prisma.expenses.delete({
          where: {
            id: eLearningExists.id,
          },
        });
      }
    }

    await prisma.distribution.update({
      where: {
        name_course_fk: {
          course_fk: id,
          name: "Honorarios académicos",
        },
      },
      data: {
        percentage: distributionPercentage,
      },
    });

    await prisma.distribution.update({
      where: {
        name_course_fk: {
          course_fk: id,
          name: "Facultad",
        },
      },
      data: {
        percentage: new Decimal(DISTRIBUTION_TYPE_TOTAL).minus(
          distributionPercentage
        ),
      },
    });

    await prisma.course.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/cursos");
    registerAction(
      Actions.update,
      `Los antecedentes generales del curso **${data.name}** fueron actualizados`
    );
    return { message: "Curso actualizado", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function getCourseName(id: number) {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  });

  return course?.name;
}

export async function getCourseById(id: string) {
  const course = await prisma.course.findUnique({
    omit: {
      program_fk: true,
      department_fk: true,
      course_director_fk: true,
      coordinator_fk: true,
    },
    where: {
      id: parseInt(id),
    },

    include: {
      program: true,
      department: {
        omit: { director_fk: true },
        include: { director: { omit: { createdAt: true, updatedAt: true } } },
      },
      course_director: { omit: { createdAt: true, updatedAt: true } },
      coordinator: { omit: { createdAt: true, updatedAt: true } },
    },
  });

  if (!course) {
    return null;
  }

  return {
    ...course,
    direct_hours: course.direct_hours.toString(),
    inperson_hours: course.inperson_hours.toString(),
    online_hours: course.online_hours.toString(),
    indirect_hours: course.indirect_hours.toString(),
  };
}

export async function getStudentsEnrolled(courseId: number, filter?: string) {
  const students = await prisma.enrolled.findMany({
    where: {
      course_fk: courseId,
      student: {
        name: {
          contains: filter,
          mode: "insensitive",
        },
      },
    },
    orderBy: {
      student: {
        name: "asc",
      },
    },
    include: {
      student: {
        select: { name: true, rut: true },
      },
    },
  });

  return students;
}

export async function getAllCourses(
  name?: string,
  payment?: string,
  year?: number
) {
  const where: any = {
    name: {
      contains: name,
      mode: "insensitive",
    },
  };

  if (year) {
    where.date_from = {
      gte: new Date(year, 0, 1),
      lt: new Date(year + 1, 0, 1),
    };
  }

  const courses = await prisma.course.findMany({
    where,
    omit: {
      program_fk: true,
      department_fk: true,
      course_director_fk: true,
      coordinator_fk: true,
    },
    include: {
      program: { select: { name: true } },
    },
    orderBy: {
      date_from: "desc",
    },
  });

  return courses;
}

export async function isStudentEnrolled(courseId: number, rut: string) {
  if (rut.length < 11) return null;

  const search = parseInt(format.notDotDash(rut));

  const student = await prisma.student.findFirst({
    where: {
      rut: { equals: search },
      NOT: {
        enrolled: {
          some: {
            course_fk: courseId,
          },
        },
      },
    },
  });

  return student;
}

export async function getAcademicsByCourse(courseId: number) {
  const academics = await prisma.participation.findMany({
    where: {
      course_fk: courseId,
    },
    omit: {
      course_fk: true,
      academic_fk: true,
      hierarchy_type_fk: true,
    },
    include: {
      academic: {
        select: {
          phone: true,
          isFOUCH: true,
          department: { select: { name: true } },
          user: { select: { name: true, rut: true, email: true } },
        },
      },
      hierarchy_type: { select: { name: true } },
    },
  });
  const invitedAcademics = [];
  const academicsFouch = [];

  for (const academic of academics) {
    if (academic.academic.isFOUCH) {
      academicsFouch.push(academic);
    } else {
      invitedAcademics.push(academic);
    }
  }

  return { academicsFouch, invitedAcademics };
}

export async function getAllPaymentTypes() {
  const paymentTypes = await prisma.paymentTypes.findMany();

  return paymentTypes;
}

export async function getAllPrograms() {
  const programs = await prisma.program.findMany();

  return programs;
}

export async function getProgramsOptions() {
  const programs = await prisma.program.findMany();

  const options: Option[] = programs.map((program) => ({
    name: program.name,
    value: program.id,
  }));

  return options;
}

export async function getPaymentOptions() {
  const paymentTypes = await prisma.paymentTypes.findMany();

  const options: Option[] = paymentTypes.map((paymentType) => ({
    name: paymentType.name,
    value: paymentType.id,
  }));

  return options;
}

export async function getIncomesValues(courseId: number) {
  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      _count: {
        select: {
          enrolled: true,
        },
      },
      enroll_value: true,
    },
  });

  if (!data) {
    return null;
  }

  return { enrollValue: data.enroll_value, students: data._count.enrolled };
}

export async function getResponsibles(courseId: number) {
  const persons = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      course_director: {
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
      coordinator: {
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

  return persons;
}

export type getResponsiblesResponse = ReturnType<typeof getResponsibles>;
export type getAllProgramsResponse = ReturnType<typeof getAllPrograms>;
export type getAcademicsByCourseResponse = ReturnType<
  typeof getAcademicsByCourse
>;
export type isStudentEnrolledResponse = ReturnType<typeof isStudentEnrolled>;
export type getAllCoursesResponse = ReturnType<typeof getAllCourses>;
export type getCourseByIdResponse = ReturnType<typeof getCourseById>;
export type getAllPaymentTypesResponse = ReturnType<typeof getAllPaymentTypes>;
