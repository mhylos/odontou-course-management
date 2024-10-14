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
      <div>
        
      </div>
    </main>
  );
}
