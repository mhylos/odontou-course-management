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
      <div className="border-2 rounded border-solid border-primary">
        <h2 className="text-4xl font-extralight text-center">
          Inicio de Sesión
        </h2>
        <form>
          <label htmlFor="rut">RUT</label>
          <input
            type="text"
            id="rut"
            name="rut"
            className="rounded border-solid border-primary border-b-2 outline-none"
          />
        </form>
      </div>
    </main>
  );
}
