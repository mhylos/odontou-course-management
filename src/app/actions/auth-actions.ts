"use server";

import { LoginSchema } from "@/lib/zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(data: LoginSchema) {
  try {
    await signIn("credentials", {
      rut: data.rut,
      password: data.password,
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
