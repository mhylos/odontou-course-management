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

export async function getAllCourses(name?: string) {
  const courses = await prisma.course.findMany({
    where: {
      name: {
        contains: name,
      },
    },
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

export async function getAcademicsByCourse() {
  const academicsFouch = [
    {
      name: "SYLVIA OSORIO MUÑOZ",
      department: "Dpto. Patología y Medicina Oral",
      hierarchy: "Profesor Asistente",
      dedicationHrs: 0,
      contractHrs: 44,
      fee: 0,
      otherProgramsHrs: 0,
    },
    {
      name: "ANDRÉS IGNACIO ROSA VALENCIA",
      department: "ICOD",
      hierarchy: "Profesor Asistente",
      dedicationHrs: 0,
      contractHrs: 33,
      fee: 0,
      otherProgramsHrs: 0,
    },
    {
      name: "ARNOLDO HERNÁNDEZ CALDERA",
      department: "ICOD",
      hierarchy: "Profesor Asistente",
      dedicationHrs: 0,
      contractHrs: 11,
      fee: 0,
      otherProgramsHrs: 0,
    },
    {
      name: "JORGE LEMUS ESPINOZA",
      department: "ICOD",
      hierarchy: "Profesor Asistente",
      dedicationHrs: 0,
      contractHrs: 0,
      fee: 0,
      otherProgramsHrs: 0,
    },
    {
      name: "MAURICIO SANDOVAL TOBAR",
      department: "ICOD",
      hierarchy: "Instructor",
      dedicationHrs: 0,
      contractHrs: 17,
      fee: 0,
      otherProgramsHrs: 0,
    },
    {
      name: "RODRIGO HERNÁNDEZ QUEZADA",
      department: "ICOD",
      hierarchy: "Ayudante",
      dedicationHrs: 0,
      contractHrs: 6,
      fee: 0,
      otherProgramsHrs: 0,
    },
  ];

  return { academicsFouch, invitedAcademics: [] };
}

export type getAcademicsByCourseResponse = ReturnType<
  typeof getAcademicsByCourse
>;
export type isStudentEnrolledResponse = ReturnType<typeof isStudentEnrolled>;
export type getAllCoursesResponse = ReturnType<typeof getAllCourses>;
export type getCourseByIdResponse = ReturnType<typeof getCourseById>;
