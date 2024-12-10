import { auth } from "@/auth";
import SubtitlePage from "@/components/common/SubtitlePage";
import Table from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";

export default async function Home() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <>
      <TitlePage>
        Panel de gestión de pagos y cobros {session?.user?.id}
      </TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <SubtitlePage className="bg-secondary text-white p-2 rounded">
          Últimas operaciones
        </SubtitlePage>
        <div className="flex-1 overflow-auto">
          <Table
            headers={["Fecha", "Usuario", "Acción", "Descripción"]}
            rows={Array.from({ length: 20 }, () => [
              "2021-10-10",
              "Admin",
              "Acción",
              "Descripción",
            ])}
          />
        </div>
      </div>
    </>
  );
}
