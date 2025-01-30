import ActionRowButton from "@/components/common/Table/ActionRowButton";
import RestartPasswordButton from "@/components/common/Table/RestartPasswordButton";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { restoreRun } from "@/lib/utils";
import { getAcademicsTable } from "@/services/academicsServices";
import Link from "next/link";

export default async function Academics() {
  const academics = await getAcademicsTable();

  return (
    <>
      <TitlePage>Académicos</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <Link href="/academicos/nuevo" className="button w-max">
          Nuevo académico
        </Link>

        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              { title: "RUT", width: "15%" },
              { title: "Nombre" },
              { title: "Teléfono", width: "10%" },
              { title: "Correo electrónico", width: "20%" },
              { title: "Pertenece a FOUCh" },
              { title: "Departmento", width: "20%" },
              { title: "Acciones", width: "15%" },
            ]}
          >
            {academics.map(({ user, isFOUCH, phone, department }, index) => {
              return (
                <Row key={user.rut} currentRow={index + 1}>
                  <Cell>{restoreRun(user.rut)}</Cell>
                  <Cell className="capitalize">
                    {user.name?.toLowerCase() ?? ""}
                  </Cell>
                  <Cell>{phone ?? ""}</Cell>
                  <Cell>{user.email ?? ""}</Cell>
                  <Cell className="">
                    {isFOUCH ? (
                      <span className="icon-[ph--check-bold] text-primary" />
                    ) : (
                      <span className="icon-[ph--x-bold]" />
                    )}
                  </Cell>
                  <Cell>{department.name}</Cell>
                  <Cell className="flex gap-2">
                    <ActionRowButton href={`/academicos/editar/${user.rut}`}>
                      <span className="icon-[ph--note-pencil] text-xl" />
                    </ActionRowButton>
                    <RestartPasswordButton rut={user.rut} />
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </div>
      </div>
    </>
  );
}
