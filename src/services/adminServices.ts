"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { capitalizeAll, runToNumber } from "@/lib/utils";
import { AdminSchemaType } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { registerAction } from "./loggerServices";
import { Actions } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllAdmins() {
  const session = await auth();

  const admins = await prisma.administrator.findMany({
    where: {
      user_fk: {
        not: session?.user.rut,
      },
    },
    select: {
      user: {
        select: {
          name: true,
          rut: true,
          email: true,
        },
      },
    },
  });
  return admins;
}

export async function createAdmin(data: AdminSchemaType) {
  try {
    const formattedRut = runToNumber(data.rut);
    const hashedPassword = await bcrypt.hash(data.rut, 10);
    await prisma.administrator.upsert({
      where: {
        user_fk: formattedRut,
      },
      update: {},
      create: {
        user: {
          create: {
            rut: formattedRut,
            name: data.name.toLowerCase(),
            email: data.email,
            password: hashedPassword,
          },
        },
      },
    });

    registerAction(
      Actions.create,
      `Administrador **${capitalizeAll(data.name)}** creado`
    );
    revalidatePath("/administradores");
    return { success: true, message: "Administrador creado exitosamente" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al crear el administrador" };
  }
}

export async function revokeAccess(rut: number) {
  try {
    const user = await prisma.administrator.delete({
      where: {
        user_fk: rut,
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    registerAction(
      Actions.delete,
      `Se le ha revocado el acceso de administrador al usuario **${capitalizeAll(
        user.user.name ?? ""
      )}**`
    );
    revalidatePath("/administradores");
    return {
      success: true,
      message: "Se le ha revocado el acceso de administrador al usuario",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "El usuario no es un administrador",
    };
  }
}
