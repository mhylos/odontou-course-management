import { auth } from "@/auth";
import LoginForm from "@/components/login/LoginForm";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <Image
        src="/logo.png"
        alt="Logo de la Escuela de Graduados de Odontología de la Universidad de Chile"
        width={655}
        height={100}
      />
      <div className="border-2 rounded border-solid border-primary flex overflow-hidden">
        <div className="p-5 flex flex-col flex-1 gap-10 h-full w-80">
          <h2 className="text-4xl font-extralight text-center">
            Inicio de Sesión
          </h2>
          <LoginForm />
        </div>
        <Image
          src="/login_side_bg.png"
          alt="Logo de la Universidad de Chile"
          width={300}
          height={400}
          className="object-cover"
        />
      </div>
    </main>
  );
}
