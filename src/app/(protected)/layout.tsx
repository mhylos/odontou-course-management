import { auth } from "@/auth";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import { Roles } from "@/lib/definitions";
import {
  ADMIN_SIDEBAR_ROUTES,
  ACADEMIC_SIDEBAR_ROUTES,
} from "@/lib/sidebar.routes";

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const sidebarRoutes = [];
  if (session.user.roles?.includes(Roles.ADMIN))
    sidebarRoutes.push(...ADMIN_SIDEBAR_ROUTES);
  if (session.user.roles?.includes(Roles.ACADEMIC))
    sidebarRoutes.push(...ACADEMIC_SIDEBAR_ROUTES);

  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <Sidebar routes={sidebarRoutes} user={session.user} />
      {modal}
      <main className="p-5 grid grid-rows-[10rem_1fr] gap-2 h-screen">
        {children}
      </main>
    </div>
  );
}
