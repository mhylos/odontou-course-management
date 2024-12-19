import Table from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { getAcademics } from "@/services/academicsServices";

export default async function Academics() {
  const academics = await getAcademics();

  return (
    <>
      <TitlePage>Académicos</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              "Nombre",
              "Horas totales",
              "Función",
              "Cant. programas",
              "Monto a pagar",
            ]}
            rows={
              academics?.map(({ user, manages }) => [
                user.name,
                "0",
                "Director",
                manages.length,
                "$0",
              ]) ?? []
            }
          />
        </div>
      </div>
    </>
  );
}
