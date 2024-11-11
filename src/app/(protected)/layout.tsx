import { auth } from "@/auth";
import Sidebar from "@/components/common/Sidebar/Sidebar";

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <>
      <Sidebar
        routes={[
          {
            title: "Inicio",
            href: "/",
          },
          {
            title: "Cursos",
            href: "/courses",
          },
        ]}
      />
      {modal}
      <main className="p-5">{children}</main>
    </>
  );
}
