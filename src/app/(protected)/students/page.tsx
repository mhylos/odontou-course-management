"use client";

import Table from "@/components/common/Table/Table";
import TitlePage from "@/components/common/TitlePage";
import { fetcher } from "@/lib/utils";
import { getAllStudentsResponse } from "@/services/studentServices";
import useSWR from "swr";

export default function Students() {
  const { data, isLoading } = useSWR<Awaited<getAllStudentsResponse>>(
    "/api/students",
    fetcher
  );

  return (
    <>
      <TitlePage>Estudiantes</TitlePage>
      <div className="flex flex-col gap-2 overflow-auto">
        <div className="flex-1 overflow-auto">
          <Table
            isFetching={isLoading}
            headers={["Nombre", "RUT", "Email", "Programas inscritos"]}
            rows={
              data?.map(({ name, rut, email, enrolled }) => [
                name,
                rut,
                email,
                enrolled.length,
              ]) ?? []
            }
          />
        </div>
      </div>
    </>
  );
}
