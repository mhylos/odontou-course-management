"use server";

import { auth } from "@/auth";
import { EnrollCreate, Student } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export async function getAllStudents() {
  const students = await prisma.student.findMany({
    include: { enrolled: true },
  });

  return students;
}

export async function addStudentToCourse(
  courseId: number,
  student: Student,
  enroll: EnrollCreate
) {
  const session = await auth();
  let response;
  if (
    (await prisma.student.findUnique({
      where: {
        rut: student.rut,
      },
    })) === null
  ) {
    response = await prisma.student.create({
      data: {
        ...student,
        enrolled: {
          connectOrCreate: {
            create: { ...enroll, course_fk: courseId },
            where: {
              student_fk_course_fk: {
                student_fk: student.rut,
                course_fk: courseId,
              },
            },
          },
        },
      },
    });
  } else {
    response = await prisma.enrolled.create({
      data: {
        ...enroll,
        student: {
          connect: {
            rut: student.rut,
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
    student: student,
    student_fk: student.rut,
    course_fk: courseId,
    ...enroll,
  };

  if (session?.user?.id) {
    await prisma.logger.create({
      data: {
        user_fk: parseInt(session.user.id),
        action: "Creación",
        description: `El estudiante ${student.rut} fue inscrito en el curso ${courseId}`,
        timestamp: new Date(),
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
