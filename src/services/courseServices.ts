"use server";

import prisma from "@/lib/prisma";
import { format } from "rutility";

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
      enrolled: {
        omit: {
          student_fk: true,
          course_fk: true,
        },
        include: {
          student: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  return course;
}

export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    omit: {
      program_fk: true,
      department_fk: true,
      course_director_fk: true,
      coordinator_fk: true,
    },
    include: {
      program: { select: { name: true } },
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

export type isStudentEnrolledResponse = ReturnType<typeof isStudentEnrolled>;
export type getAllCoursesResponse = ReturnType<typeof getAllCourses>;
export type getCourseByIdResponse = ReturnType<typeof getCourseById>;
