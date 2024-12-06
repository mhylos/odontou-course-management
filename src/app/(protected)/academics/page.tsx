"use client";

import Table from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

type getAllAcademicsResponse = Array<{
  isFOUCH: boolean;
  user: {
    rut: number;
    name: string;
  };
  manages: [];
  department: {
    name: string;
  };
}>;

export default function Academics() {
  const { data, isLoading } = useSWR<getAllAcademicsResponse>(
    "/api/academics",
    fetcher
  );

  return (
    <>
      <TitlePage>Académicos</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table
            isFetching={isLoading}
            headers={[
              "Nombre",
              "Horas totales",
              "Función",
              "Cant. programas",
              "Monto a pagar",
            ]}
            rows={
              data?.map(({ user, manages }) => [
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
