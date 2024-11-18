import { auth } from "@/auth";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import { redirect } from "next/navigation";

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="grid grid-cols-[20rem_1fr] h-screen">
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
      <main className="p-5 grid grid-rows-[10rem_1fr] gap-2 h-screen">
        {children}
      </main>
    </div>
  );
}
