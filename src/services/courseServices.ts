"use server";

import prisma from "@/lib/prisma";
import { format } from "rutility";
import { Option } from "@/components/common/Dropdown";
import { createCourseSchemaType } from "@/lib/zod";
import { revalidatePath } from "next/cache";

export async function createCourse(data: createCourseSchemaType) {
  try {
    await prisma.course.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/courses");
    return { message: "Curso creado con éxito", success: true };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
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

export async function getAcademicsByCourse(courseId: number) {
  const academics = await prisma.manages.findMany({
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
        select: { isFOUCH: true },
        include: {
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

export async function getDepartments(name?: string) {
  const departments = await prisma.department.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });

  return departments;
}

export async function getDepartmentsOptions(name?: string) {
  const departments = await prisma.department.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });

  const options: Option[] = departments.map((department) => ({
    name: department.name,
    value: department.id,
  }));

  return options;
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

export type getDepartmentsResponse = ReturnType<typeof getDepartments>;
export type getAllProgramsResponse = ReturnType<typeof getAllPrograms>;
export type getAcademicsByCourseResponse = ReturnType<
  typeof getAcademicsByCourse
>;
export type isStudentEnrolledResponse = ReturnType<typeof isStudentEnrolled>;
export type getAllCoursesResponse = ReturnType<typeof getAllCourses>;
export type getCourseByIdResponse = ReturnType<typeof getCourseById>;
export type getAllPaymentTypesResponse = ReturnType<typeof getAllPaymentTypes>;
