import SubtitlePage from "@/components/common/SubtitlePage";
import Table, { Cell, Row } from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { ACTIONS_DICTIONARY } from "@/lib/constants";
import { getLogs } from "@/services/loggerServices";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default async function Home() {
  const logs = await getLogs();

  return (
    <>
      <TitlePage>Panel de gestión de pagos y cobros</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <SubtitlePage className="bg-secondary text-white p-2 rounded">
          Últimas operaciones
        </SubtitlePage>
        <div className="flex-1 overflow-auto">
          <Table
            headers={[
              { title: "Fecha" },
              { title: "Usuario" },
              { title: "Acción", width: "15%" },
              { title: "Descripción", width: "50%" },
            ]}
          >
            {logs.map((log) => (
              <Row key={log.id} currentRow={log.id}>
                <Cell>{format(log.timestamp, "Pp")}</Cell>
                <Cell className="capitalize">
                  {log.user.name?.toLowerCase() ?? ""}
                </Cell>
                <Cell>{ACTIONS_DICTIONARY[log.action]}</Cell>
                <Cell>
                  <ReactMarkdown>{log.description}</ReactMarkdown>
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
