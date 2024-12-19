"use server";

import RegisterAdminForm from "@/components/start/registerAdminForm";
// import { checkStarted } from "@/services/userServices";
import Image from "next/image";
// import { redirect } from "next/navigation";

export default async function Start() {
  // if (await checkStarted()) {
  //   redirect("/");
  // }

  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <Image
        src="/logo.png"
        alt="Logo de la Escuela de Graduados de Odontología de la Universidad de Chile"
        width={655}
        height={100}
      />
      <div className="border-2 rounded border-solid border-primary flex overflow-hidden">
        <div className="p-5 flex flex-col flex-1 gap-10 h-full w-[70%]">
          <h2 className="text-4xl font-extralight text-center">
            Creación del usuario administrador
          </h2>
          <RegisterAdminForm />
        </div>
      </div>
    </main>
  );
}
