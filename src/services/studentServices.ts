"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runToNumber } from "@/lib/utils";
import { enrollSchemaType, studentSchemaType } from "@/lib/zod";

export async function getAllStudents() {
  const students = await prisma.student.findMany({
    include: { enrolled: true },
  });

  return students;
}

export async function addStudentToCourse(
  courseId: number,
  student: studentSchemaType,
  enroll: enrollSchemaType
) {
  const session = await auth();
  const rut = runToNumber(student.rut);
  const { payment_type_fk, ...enrollData } = enroll;

  if (
    (await prisma.student.findUnique({
      where: {
        rut: rut,
      },
    })) === null
  ) {
    await prisma.student.create({
      data: {
        ...student,
        rut: rut,
        enrolled: {
          create: {
            ...enrollData,
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
    await prisma.enrolled.create({
      data: {
        ...enrollData,
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
    });
  }

  const newEnrolled = {
    student: { ...student, rut: rut },
    student_fk: rut,
    course_fk: courseId,
    ...enroll,
  };

  if (session?.user?.id) {
    await prisma.logger.create({
      data: {
        action: "Creación",
        description: `El estudiante ${student.rut} fue inscrito en el curso ${courseId}`,
        timestamp: new Date(),
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  }

  return newEnrolled;
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
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export type getAllStudentsResponse = ReturnType<typeof getAllStudents>;
export type addStudentToCourseResponse = ReturnType<typeof addStudentToCourse>;
