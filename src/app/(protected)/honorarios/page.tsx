import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";

export default async function Honorariums() {
  // const honorariums = await getHonorariumsByRut();

  return (
    <>
      <TitlePage>Honorarios</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              { title: "Curso" },
              { title: "Función" },
              { title: "Monto" },
              { title: "Fecha del ultimo pago" },
            ]}
          ></Table>
        </div>
      </div>
    </>
  );
}
