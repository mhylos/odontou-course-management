"use server";

import prisma from "@/lib/prisma";

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
      enrolled: true,
    },
  });

  if (!course) {
    return null;
  }

  return course;
}

export type CourseResponse = ReturnType<typeof getCourseById>;
