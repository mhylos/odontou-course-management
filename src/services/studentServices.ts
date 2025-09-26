"use server";

import { Option } from "@/components/common/Dropdown";
import prisma from "@/lib/prisma";
import {
  adjustNumber,
  capitalizeAll,
  restoreRun,
  runToNumber,
} from "@/lib/utils";
import {
  EnrollSchemaType,
  StudentEnrollSchemaType,
  StudentSchemaType,
} from "@/lib/zod";
import { Actions } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { recalculateFee } from "./incomesServices";
import { registerAction } from "./loggerServices";

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

export async function upsertStudent(student: StudentSchemaType) {
  const rut = runToNumber(student.rut);
  const { rut: _, ...studentData } = student;

  try {
    const studentUpserted = await prisma.student.upsert({
      where: {
        rut: rut,
      },
      create: {
        ...studentData,
        name: student.name.toUpperCase(),
        rut: rut,
        ...(student.email ? { email: student.email.toLocaleLowerCase() } : {}),
      },
      update: {
        ...studentData,
        name: student.name.toUpperCase(),
        ...(student.email ? { email: student.email.toLocaleLowerCase() } : {}),
      },
      select: {
        created_at: true,
        updated_at: true,
      },
    });
    registerAction(
      Actions.create,
      `Estudiante **${capitalizeAll(student.name)}**, **RUT: ${restoreRun(
        rut
      )}** $${
        studentUpserted.created_at === studentUpserted.updated_at
          ? "creado"
          : "actualizado"
      }`
    );

    return { success: true, message: "Estudiante guardado" };
  } catch (error) {
    console.error("Error upserting student:", error);
    return { success: false, message: "Error al guardar estudiante" };
  }
}

export async function upsertStudentEnroll(
  courseId: number,
  studentEnroll: StudentEnrollSchemaType
) {
  // const student = JSON.parse(
  //   formData.get("student") as string
  // ) as StudentSchemaType;
  // const enroll = JSON.parse(
  //   formData.get("enroll") as string
  // ) as EnrollSchemaType;
  // const file = formData.get("file") as File;
  const rut = studentEnroll.rut;
  const { payment_type_fk, ...enrollData } = studentEnroll.enroll;
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
    return { success: false, message: "El estudiante no existe" };
  }
  // if (!foundStudent) {
  //   await prisma.student.create({
  //     data: {
  //       ...student,
  //       name: student.name.toUpperCase(),
  //       rut: rut,
  //       ...(student.email ? { email: student.email.toLocaleLowerCase() } : {}),
  //       enrolled: {
  //         create: {
  //           ...enrollData,
  //           // file: filename,
  //           payment: payment_type_fk
  //             ? { connect: { id: payment_type_fk } }
  //             : undefined,
  //           course: {
  //             connect: {
  //               id: courseId,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  //   await registerAction(
  //     Actions.create,
  //     `Estudiante **${capitalizeAll(student.name)}**, **RUT: ${restoreRun(
  //       rut
  //     )}** ingresado al sistema`
  //   );
  //   registerAction(
  //     Actions.create,
  //     `Inscripción de estudiante **${capitalizeAll(
  //       student.name
  //     )}** **RUT: ${restoreRun(rut)}** en curso **${course?.name}**`
  //   );
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

  const isUpdate = enroll.updated_at !== enroll.created_at;

  if (!isUpdate) {
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

  revalidatePath(`/cursos/detalles/${courseId}/estudiantes`);
  await recalculateFee(courseId);
  revalidatePath(`/cursos/detalles/${courseId}/ingresos`);

  return { success: true, message: "Inscripción guardada" };
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
      ...(rut
        ? {
            rut: {
              in: [adjustNumber(rut, 7), adjustNumber(rut, 8)],
            },
          }
        : {}),
    },
    select: {
      rut: true,
      name: true,
    },
  });

  const options: Option[] = students.map((student) => ({
    name: `${restoreRun(student.rut)} - ${student.name}`,
    value: student.rut,
  }));

  return options;
}

export async function getStudentOptionByRut(rut: number) {
  const student = await prisma.student.findUnique({
    where: { rut },
  });

  if (!student) return null;

  const option: Option = {
    name: `${restoreRun(student.rut)} - ${student.name}`,
    value: student.rut,
  };

  return option;
}

export type getAllStudentsResponse = ReturnType<typeof getAllStudents>;
export type upsertStudentEnrollResponse = ReturnType<
  typeof upsertStudentEnroll
>;
