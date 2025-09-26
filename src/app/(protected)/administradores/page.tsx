import RevokeButton from "@/components/administrador/RevokeButton";
import RestartPasswordButton from "@/components/common/Table/RestartPasswordButton";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { restoreRun } from "@/lib/utils";
import { getAllAdmins } from "@/services/adminServices";
import Link from "next/link";

export default async function Admins() {
  const students = await getAllAdmins();

  return (
    <>
      <TitlePage>Administradores</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <Link href="/administradores/nuevo" className="button w-max">
          Nuevo administrador
        </Link>
        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              { title: "Nombre" },
              { title: "RUT" },
              { title: "Email" },
              { title: "" },
            ]}
          >
            {students.map(({ user: { rut, name, email } }, index) => (
              <Row key={rut} currentRow={index + 1}>
                <Cell className="capitalize">{name?.toLowerCase()}</Cell>
                <Cell>{restoreRun(rut)}</Cell>
                <Cell>{email ?? ""}</Cell>
                <Cell className="flex gap-2">
                  <RevokeButton rut={rut} />
                  <RestartPasswordButton rut={rut} />
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
