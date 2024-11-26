"use server";

import { loginSchemaType, registerSchemaType, registerSchema } from "@/lib/zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { isValidRut, format } from "rutility";
import bcrypt from "bcryptjs";
import db from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createAdminAction(values: registerSchemaType) {
  try {
    const { data, success } = registerSchema.safeParse(values);

    if (!success) {
      return { success: false, message: "Error en los datos ingresados" };
    }

    if (!isValidRut(data.rut)) {
      return { success: false, message: "RUT inválido" };
    }
    const formattedRut = parseInt(format.notDotDash(data.rut));

    const password = await bcrypt.hash(data.password, 10);

    await db.user.create({
      data: {
        rut: formattedRut,
        name: data.name,
        email: data.email,
        password,
      },
    });

    await db.administrator.create({
      data: { user_fk: formattedRut },
    });

    await signIn("credentials", {
      rut: data.rut,
      password: data.password,
      redirectTo: "/",
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error inesperado" };
  }
  redirect("/");
}

export async function loginAction(values: loginSchemaType) {
  try {
    await signIn("credentials", {
      rut: values.rut,
      password: values.password,
      redirect: false,
    });

    return { success: true, message: "Inicio de sesión exitoso" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: error.cause?.err?.message };
    }
    return { success: false, message: "Error inesperado" };
  }
}

export async function logoutAction() {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (e) {
    throw e;
  }
}
