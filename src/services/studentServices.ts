"use server";

import prisma from "@/lib/prisma";
import {
  adjustNumber,
  capitalizeAll,
  restoreRun,
  runToNumber,
} from "@/lib/utils";
import { EnrollSchemaType, StudentSchemaType } from "@/lib/zod";
import { mkdir, stat, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { recalculateFee } from "./incomesServices";
import { Option } from "@/components/common/Dropdown";
import { registerAction } from "./loggerServices";
import { Actions } from "@prisma/client";

export async function getAllStudents() {
  const students = await prisma.student.findMany({
    select: {
      name: true,
      rut: true,
      email: true,
      _count: {
        select: {
          enrolled: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return students;
}

export async function upsertStudentEnroll(
  courseId: number,
  student: StudentSchemaType,
  enroll: EnrollSchemaType
) {
  // const student = JSON.parse(
  //   formData.get("student") as string
  // ) as StudentSchemaType;
  // const enroll = JSON.parse(
  //   formData.get("enroll") as string
  // ) as EnrollSchemaType;
  // const file = formData.get("file") as File;
  const rut = runToNumber(student.rut);
  const { payment_type_fk, ...enrollData } = enroll;
  // let filename = null;
  // if (file) {
  //   const buffer = Buffer.from(await file.arrayBuffer());
  //   filename = `${rut}_${courseId}.${file.name.split(".").pop()}`;
  //   const uploadDir = join(process.cwd(), "public", "comprobantes");
  //   try {
  //     await stat(uploadDir);
  //   } catch (e) {
  //     if ((e as NodeJS.ErrnoException).code === "ENOENT") {
  //       await mkdir(uploadDir, { recursive: true });
  //     }
  //     await writeFile(`${uploadDir}/${filename}`, buffer);
  //   }
  // }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      name: true,
    },
  });
  const foundStudent = await prisma.student.findUnique({
    where: {
      rut: rut,
    },
  });
  if (!foundStudent) {
    await prisma.student.create({
      data: {
        ...student,
        name: student.name.toUpperCase(),
        rut: rut,
        enrolled: {
          create: {
            ...enrollData,
            // file: filename,
            payment: payment_type_fk
              ? { connect: { id: payment_type_fk } }
              : undefined,
            course: {
              connect: {
                id: courseId,
              },
            },
          },
        },
      },
    });
    await registerAction(
      Actions.create,
      `Estudiante **${capitalizeAll(student.name)}**, **RUT: ${restoreRun(
        rut
      )}** ingresado al sistema`
    );
    registerAction(
      Actions.create,
      `Inscripción de estudiante **${capitalizeAll(
        student.name
      )}** **RUT: ${restoreRun(rut)}** en curso **${course?.name}**`
    );
  } else {
    const enroll = await prisma.enrolled.upsert({
      where: {
        student_fk_course_fk: {
          student_fk: rut,
          course_fk: courseId,
        },
      },
      create: {
        ...enrollData,
        // file: filename,
        payment: payment_type_fk
          ? { connect: { id: payment_type_fk } }
          : undefined,
        student: {
          connect: {
            rut: rut,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
      },
      update: {
        ...enrollData,
        // file: filename,
        payment: payment_type_fk
          ? { connect: { id: payment_type_fk } }
          : undefined,
      },
      select: {
        updated_at: true,
        created_at: true,
      },
    });

    if (enroll.updated_at == enroll.created_at) {
      registerAction(
        Actions.create,
        `Inscripción de estudiante **${restoreRun(rut)}** en curso **${
          course?.name
        }**`
      );
    } else {
      registerAction(
        Actions.update,
        `Actualización en la inscripción de estudiante **${restoreRun(
          rut
        )}** en curso **${course?.name}**`
      );
    }
  }

  revalidatePath(`/cursos/detalles/${courseId}/estudiantes`);
  await recalculateFee(courseId);
  revalidatePath(`/cursos/detalles/${courseId}/ingresos`);

  return { success: true, message: "Estudiante inscrito" };
}

export async function getEnroll(rut: number, courseId: number) {
  const enroll = await prisma.enrolled.findFirst({
    where: {
      student_fk: rut,
      course_fk: courseId,
    },
    include: {
      payment: true,
      student: true,
    },
  });

  if (!enroll) return null;

  return { ...enroll, discount: enroll.discount.toString() };
}

export async function removeEnrollByRut(rut: number, courseId: number) {
  try {
    const enroll = await prisma.enrolled.delete({
      where: {
        student_fk_course_fk: {
          student_fk: rut,
          course_fk: courseId,
        },
      },
      select: {
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    registerAction(
      Actions.delete,
      `Estudiante **${restoreRun(rut)}** eliminado del curso **${
        enroll.course.name
      }**`
    );
    revalidatePath(`/cursos/detalles/${courseId}/estudiantes`);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getStudentsOptions(rut?: number) {
  const students = await prisma.student.findMany({
    take: 5,
    where: {
      rut: {
        gte: adjustNumber(rut || 0, 7),
      },
    },
    select: {
      rut: true,
      name: true,
    },
  });

  const options: Option[] = students.map((student) => ({
    name: student.name,
    value: student.rut,
  }));

  return options;
}

export type getAllStudentsResponse = ReturnType<typeof getAllStudents>;
export type upsertStudentEnrollResponse = ReturnType<
  typeof upsertStudentEnroll
>;
