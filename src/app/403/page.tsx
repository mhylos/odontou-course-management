import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="grid h-screen place-items-center bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <Link href="/" className="space-y-5">
            <Image
              src={"/logo.png"}
              alt="odontoulogo"
              height={200}
              width={400}
            />
          </Link>
          {/* <h1 className="dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight text-primary lg:text-9xl">
            404
          </h1> */}
          <p className="text-primary-900 mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Recurso restringido
          </p>
          <p className="mb-4 text-lg font-light text-secondary">
            El recurso solicitado requiere permisos
          </p>
          <Link href="/" className="button">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
