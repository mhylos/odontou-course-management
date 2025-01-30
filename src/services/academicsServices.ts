"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AcademicParticipationSchemaType, AcademicSchemaType } from "@/lib/zod";
import { capitalizeAll, restoreRun, runToNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { upsertAcademicsHonorariums } from "./honorariumServices";
import { AcademicFunctions, Actions } from "@prisma/client";
import Decimal from "decimal.js";
import { registerAction } from "./loggerServices";
import { Option } from "@/components/common/Dropdown";

export async function getAcademicsTable() {
  const academics = await prisma.academic.findMany({
    omit: { user_fk: true, department_fk: true },
    include: {
      user: { select: { rut: true, name: true, email: true } },
      department: { select: { name: true } },
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return academics;
}

export async function getAcademicToEdit(
  rut: number
): Promise<AcademicSchemaType | null> {
  const academic = await prisma.academic.findUnique({
    where: { user_fk: rut },
    select: {
      user: {
        select: {
          rut: true,
          name: true,
          email: true,
        },
      },
      isFOUCH: true,
      phone: true,
      department_fk: true,
    },
  });

  if (!academic) return null;

  return {
    rut: restoreRun(academic.user.rut),
    name: academic.user.name ?? "",
    email: academic.user.email,
    department_fk: academic.department_fk,
    isFOUCH: academic.isFOUCH,
    phone: academic.phone,
  };
}

export async function getAcademicOptionByRun(run: number) {
  if (!run) {
    return null;
  }
  const academic = await prisma.academic.findUnique({
    where: {
      user_fk: run,
    },
    select: {
      user: {
        select: {
          name: true,
          rut: true,
        },
      },
    },
  });

  if (!academic) {
    return null;
  }

  const option: Option = {
    name:
      capitalizeAll(
        academic.user.name ? academic.user.name.toLowerCase() : ""
      ) +
      " - " +
      restoreRun(academic.user.rut),
    value: academic.user.rut,
  };

  return option;
}

export async function getAcademicsOptions(name?: string, rut?: number) {
  const academics = await prisma.academic.findMany({
    take: 5,
    where: {
      user: {
        OR: [
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            rut: {
              equals: rut,
            },
          },
        ],
      },
    },
    select: {
      user: {
        select: {
          name: true,
          rut: true,
        },
      },
    },
    orderBy: {
      user: {
        createdAt: "desc",
      },
    },
  });

  const options: Option[] = academics.map((academic) => ({
    name:
      capitalizeAll(
        academic.user.name ? academic.user.name.toLowerCase() : ""
      ) +
      " - " +
      restoreRun(academic.user.rut),
    value: academic.user.rut,
  }));

  return options;
}

export async function createAcademic(data: AcademicSchemaType) {
  const academicExists = await prisma.academic.findUnique({
    where: {
      user_fk: runToNumber(data.rut),
    },
  });

  if (academicExists) {
    return { message: "El académico ya existe", success: false };
  }

  try {
    const password = await bcrypt.hash(data.rut.toString(), 10);

    await prisma.user.upsert({
      where: {
        rut: runToNumber(data.rut),
      },
      create: {
        rut: runToNumber(data.rut),
        name: data.name.toLowerCase(),
        email: data.email,
        password: password,
        academic: {
          create: {
            isFOUCH: data.isFOUCH,
            department_fk: data.department_fk,
          },
        },
      },
      update: {
        academic: {
          create: {
            isFOUCH: data.isFOUCH,
            department_fk: data.department_fk,
          },
        },
      },
    });

    registerAction(
      Actions.create,
      `Académico **${capitalizeAll(data.name)}** ingresado al sistema`
    );
    revalidatePath("/api/academics/options");
    revalidatePath("/academicos");
    return { message: "Académico creado con éxito", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function updateAcademic(rut: number, data: AcademicSchemaType) {
  try {
    await prisma.academic.update({
      where: {
        user_fk: rut,
      },
      data: {
        isFOUCH: data.isFOUCH,
        department_fk: data.department_fk,
        phone: data.phone,
      },
    });

    registerAction(
      Actions.update,
      `Datos del académico **${capitalizeAll(data.name)}** actualizados`
    );
    revalidatePath("/api/academics/options");
    revalidatePath("/academicos");
    return { message: "Académico actualizado con éxito", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function getHierarchyOptions() {
  const hierarchyTypes = await prisma.hierarchyTypes.findMany();

  const options: Option[] = hierarchyTypes.map((type) => ({
    name: type.name,
    value: type.id,
  }));

  return options;
}

export async function getHierarchyOptionById(id: number) {
  const hierarchyType = await prisma.hierarchyTypes.findUnique({
    where: { id },
  });

  if (!hierarchyType) {
    return null;
  }

  const option: Option = {
    name: hierarchyType.name,
    value: hierarchyType.id,
  };

  return option;
}

export async function upsertAcademicParticipation(
  courseId: number,
  data: AcademicParticipationSchemaType
) {
  try {
    const participation = await prisma.participation.upsert({
      where: {
        academic_fk_course_fk: {
          academic_fk: data.academic_fk,
          course_fk: courseId,
        },
      },
      create: {
        academic_fk: data.academic_fk,
        course_fk: courseId,
        hierarchy_type_fk: data.hierarchy_type_fk,
        dedicated_hours: data.dedicated_hours,
        contract_hours: data.contract_hours,
      },
      update: {
        hierarchy_type_fk: data.hierarchy_type_fk,
        dedicated_hours: data.dedicated_hours,
        contract_hours: data.contract_hours,
      },
      select: {
        created_at: true,
        updated_at: true,
        id: true,
        course: { select: { name: true } },
        academic: { select: { user: { select: { name: true } } } },
      },
    });

    if (participation.created_at === participation.updated_at) {
      registerAction(
        Actions.create,
        `Participación del académico **${capitalizeAll(
          participation.academic.user.name ?? ""
        )}** ingresada al curso **${participation.course.name}**`
      );
    } else {
      registerAction(
        Actions.update,
        `Participación del académico **${capitalizeAll(
          participation.academic.user.name ?? ""
        )}** actualizada en el curso **${participation.course.name}**`
      );
    }

    await upsertAcademicsHonorariums(courseId, participation.id, {
      rut: data.academic_fk,
      hours: new Decimal(0),
      function: AcademicFunctions.instructor,
    });

    revalidatePath(`/cursos/detalles/${courseId}/academicos`);
    revalidatePath(`/cursos/detalles/${courseId}/pagos`);
    return { message: "Participación del académico agregada", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function getParticipation(rut: number, courseId: number) {
  return prisma.participation.findUnique({
    where: {
      academic_fk_course_fk: {
        academic_fk: rut,
        course_fk: courseId,
      },
    },
    omit: { id: true, course_fk: true },
  });
}

export async function removeParticipation(rut: number, courseId: number) {
  try {
    const participation = await prisma.participation.delete({
      where: {
        academic_fk_course_fk: {
          academic_fk: rut,
          course_fk: courseId,
        },
      },
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
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    registerAction(
      Actions.delete,
      `Participación del académico ${capitalizeAll(
        participation.academic.user.name ?? ""
      )} **RUT: ${restoreRun(rut)}** eliminada del curso **${
        participation.course.name
      }**`
    );
    revalidatePath(`/cursos/detalles/${courseId}/academicos`);
    revalidatePath(`/cursos/detalles/${courseId}/pagos`);
    return { message: "Participación eliminada", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
}

export async function getParticipations(courseId: number) {
  return prisma.participation.findMany({
    where: {
      course_fk: courseId,
    },
    select: {
      academic: { select: { user: { select: { name: true, rut: true } } } },
    },
  });
}

export type getAcademicsTableResponse = ReturnType<typeof getAcademicsTable>;
export type getAcademicOptionResponse = ReturnType<
  typeof getAcademicOptionByRun
>;
