"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { adjustNumber, runToNumber } from "@/lib/utils";
import { EnrollSchemaType, StudentSchemaType } from "@/lib/zod";
import { mkdir, stat, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { recalculateFee } from "./incomesServices";
import { Option } from "@/components/common/Dropdown";

export async function getAllStudents() {
  const students = await prisma.student.findMany({
    include: { enrolled: true },
  });

  return students;
}

export async function upsertStudentEnroll(
  courseId: number,
  formData: FormData
) {
  const student = JSON.parse(
    formData.get("student") as string
  ) as StudentSchemaType;
  const enroll = JSON.parse(
    formData.get("enroll") as string
  ) as EnrollSchemaType;
  const file = formData.get("file") as File;
  const rut = runToNumber(student.rut);
  const { payment_type_fk, ...enrollData } = enroll;
  let filename = null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    filename = `${rut}_${courseId}.${file.name.split(".").pop()}`;
    const uploadDir = join(process.cwd(), "public", "comprobantes");
    try {
      await stat(uploadDir);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      }
      await writeFile(`${uploadDir}/${filename}`, buffer);
    }
  }

  const foundStudent = await prisma.student.findUnique({
    where: {
      rut: rut,
    },
  });
  if (!foundStudent) {
    await prisma.student.create({
      data: {
        ...student,
        rut: rut,
        enrolled: {
          create: {
            ...enrollData,
            file: filename,
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
  } else {
    await prisma.enrolled.upsert({
      where: {
        student_fk_course_fk: {
          student_fk: rut,
          course_fk: courseId,
        },
      },
      create: {
        ...enrollData,
        file: filename,
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
        file: filename,
        payment: payment_type_fk
          ? { connect: { id: payment_type_fk } }
          : undefined,
      },
    });
  }

  await recalculateFee(courseId);

  revalidatePath(`/cursos/detalles/${courseId}/estudiantes`);
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

  return enroll;
}

export async function removeEnrollByRut(rut: number, courseId: number) {
  try {
    await prisma.enrolled.delete({
      where: {
        student_fk_course_fk: {
          student_fk: rut,
          course_fk: courseId,
        },
      },
    });

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
