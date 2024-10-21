import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <Image
        src="/logo.png"
        alt="Logo de la Escuela de Graduados de Odontología de la Universidad de Chile"
        width={655}
        height={100}
      />
      <div className="border-2 rounded border-solid border-primary h-[60%] flex overflow-hidden">
        <div className="p-5 flex flex-col flex-1 gap-10 h-full">
          <h2 className="text-4xl font-extralight text-center">
            Inicio de Sesión
          </h2>
          <form className="flex flex-col justify-between h-full">
            <fieldset className="flex flex-col gap-10">
              <Input label={"RUT"} type="text" />
              <Input label={"Contraseña"} type="password" />
            </fieldset>
            <Button>Iniciar Sesión</Button>
          </form>
        </div>
        <Image
          src="/login_side_bg.png"
          alt="Logo de la Universidad de Chile"
          width={300}
          height={400}
          className="object-cover h-full"
        />
      </div>
    </main>
  );
}
