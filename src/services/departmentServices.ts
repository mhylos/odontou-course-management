"use server";

import prisma from "@/lib/prisma";
import { CreateDepartmentSchemaType, DepartmentsSchemaType } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { Option } from "@/components/common/Dropdown";
import { registerAction } from "./loggerServices";
import { Actions } from "@prisma/client";

export async function createDepartment(data: CreateDepartmentSchemaType) {
  try {
    if (data.name === "") {
      return { message: "El nombre es obligatorio", success: false };
    }
    await prisma.department.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/cursos/ingresar");
    return {
      message: "Departamento creado con éxito",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return { message: "Error inesperado", success: false };
  }
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
    take: 5,
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

export async function updateDepartments(data: DepartmentsSchemaType) {
  try {
    await Promise.all(
      data.departments.map(async ({ departmentId, ...data }) => {
        await prisma.department.update({
          where: {
            id: departmentId,
          },
          data: {
            ...data,
          },
        });
      })
    );
    registerAction(Actions.update, "Departamentos actualizados");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
