import { auth } from "@/auth";
import Table from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import HonorariumRow from "@/components/honorarios/HonorariumRow";
import { getHonorariumsByRut } from "@/services/honorariumServices";

export default async function Honorariums() {
  const session = await auth();
  if (!session) return null;
  const honorariums = await getHonorariumsByRut(session.user.rut);

  return (
    <>
      <TitlePage>Honorarios</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table headers={[{ title: "Curso" }, { title: "", width: "10%" }]}>
            {honorariums.map((honorarium) => (
              <HonorariumRow
                key={honorarium.course.name}
                honorarium={honorarium}
              />
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
