"use server";

import { auth } from "@/auth";
import { Roles } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function checkStarted() {
  const response = await prisma.administrator.findMany();
  if (response.length > 0) {
    return true;
  } else {
    return false;
  }
}

export async function getPersonalInfo(rut: number) {
  const response = await prisma.user.findUnique({
    where: {
      rut: rut,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return response;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const session = await auth();
  console.log(session?.user.rut);

  if (!session) {
    return { success: false, message: "Usuario no autenticado" };
  }
  const user = await prisma.user.findUnique({
    where: {
      rut: session.user.rut,
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    return { success: false, message: "Usuario no encontrado" };
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  console.log(user.password);

  if (!isValidPassword) {
    return { success: false, message: "Contraseña incorrecta" };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  try {
    await prisma.user.update({
      where: {
        rut: session.user.rut,
      },
      data: {
        password: newPasswordHash,
      },
    });
    return { success: true, message: "Contraseña actualizada" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al actualizar la contraseña" };
  }
}

export async function restartPassword(rut: number) {
  const newPassword = await bcrypt.hash(rut.toString(), 10);
  try {
    await prisma.user.update({
      where: {
        rut: rut,
      },
      data: {
        password: newPassword,
      },
    });
    return { success: true, message: "Contraseña reiniciada" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al reiniciar la contraseña" };
  }
}

export async function getUserRoles(rut: number): Promise<Roles[]> {
  const response = await prisma.user.findUnique({
    where: {
      rut: rut,
    },
    select: {
      administrator: true,
      academic: true,
      director: true,
      coordinator: true,
    },
  });

  const roles: Roles[] = [];
  if (response?.administrator) {
    roles.push(Roles.ADMIN);
  }
  if (response?.academic) {
    roles.push(Roles.ACADEMIC);
  }
  if (response?.director) {
    roles.push(Roles.DIRECTOR);
  }
  if (response?.coordinator) {
    roles.push(Roles.COORDINATOR);
  }

  return roles;
}
