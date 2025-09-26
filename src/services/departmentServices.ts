"use server";

import prisma from "@/lib/prisma";
import { CreateDepartmentSchemaType, DepartmentsSchemaType } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { Option } from "@/components/common/Dropdown";
import { registerAction } from "./loggerServices";
import { Actions } from "@prisma/client";
import { capitalizeAll } from "@/lib/utils";

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
    registerAction(
      Actions.create,
      `Departamento **${capitalizeAll(data.name)}** creado`
    );
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

export async function updateDepartment(
  departmentId: number,
  data: CreateDepartmentSchemaType
) {
  try {
    if (data.name === "") {
      return { message: "El nombre es obligatorio", success: false };
    }
    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        ...data,
      },
      select: {
        name: true,
      },
    });
    registerAction(
      Actions.update,
      `Departamento **${capitalizeAll(updatedDepartment.name)}** actualizado`
    );
    revalidatePath("/departamentos");
    return {
      message: "Departamento actualizado con éxito",
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
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      director: {
        select: {
          name: true,
          rut: true,
        },
      },
      _count: {
        select: {
          courses: true,
        },
      },
    },
  });

  return departments;
}

export async function getDepartmentById(departmentId: number) {
  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
    select: {
      name: true,
      director: {
        select: {
          rut: true,
          name: true,
        },
      },
    },
  });

  return department;
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

export async function getDepartmentOptionById(departmentId: number) {
  const department = await prisma.department.findUnique({
    where: {
      id: departmentId,
    },
    select: {
      name: true,
      id: true,
    },
  });

  if (!department) return null;

  const option: Option = {
    name: department.name,
    value: department.id,
  };

  return option;
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
            name: data.name,
            director_fk: data.directorId,
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
export type GetDepartmentsResponse = ReturnType<typeof getDepartments>;
