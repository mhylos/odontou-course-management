"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAcademicSchemaType } from "@/lib/zod";
import { restoreRun, runToNumber } from "@/lib/utils";
import { Option } from "@/components/common/Dropdown";

export async function getAcademics() {
  const academics = await prisma.academic.findMany({
    omit: { user_fk: true, department_fk: true },
    include: {
      user: { select: { rut: true, name: true } },
      manages: true,
      department: { select: { name: true } },
    },
  });

  return academics;
}

export async function getAcademicsOptions(name?: string) {
  const academics = await prisma.academic.findMany({
    where: {
      user: {
        name: {
          contains: name,
        },
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
  });

  const options: Option[] = academics.map((academic) => ({
    name: academic.user.name + " - " + restoreRun(academic.user.rut),
    value: academic.user.rut,
  }));

  return options;
}

export async function createAcademic(data: createAcademicSchemaType) {
  const password = await bcrypt.hash(data.rut.toString(), 10);
  await prisma.user.create({
    data: {
      rut: runToNumber(data.rut),
      name: data.name,
      email: data.email,
      password: password,
      academic: {
        create: {
          isFOUCH: data.isFOUCH,
          department_fk: data.department_fk,
        },
      },
    },
    omit: { password: true },
  });
}

export type getAcademicsResponse = ReturnType<typeof getAcademics>;
