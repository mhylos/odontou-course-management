import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
