import Chip from "@/components/common/Chip";
import Table, { Cell, Row } from "@/components/common/Table/Table";
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
              { title: "Nombre" },
              { title: "Horas totales" },
              { title: "Función" },
              { title: "Cant. programas" },
              { title: "Monto a pagar" },
            ]}
            // rows={
            //   academics?.map(({ user, manages }) => [
            //     user.name,
            //     "0",
            //     "Director",
            //     manages.length,
            //     "$0",
            //   ]) ?? []
            // }
          >
            {academics.map(({ user, manages }, index) => {
              const totalHours = manages.reduce(
                (acc, manage) => acc + (manage.dedicated_hours ?? 0),
                0
              );

              return (
                <Row key={user.rut} currentRow={index + 1}>
                  <Cell>{user.name ?? ""}</Cell>
                  <Cell>{totalHours}</Cell>
                  <Cell>
                    <Chip>Director</Chip>
                  </Cell>
                  <Cell>{manages.length}</Cell>
                  <Cell>$0</Cell>
                </Row>
              );
            })}
          </Table>
        </div>
      </div>
    </>
  );
}
