"use client";

import { HONORARIUMS_FUNCTIONS_DICTIONARY } from "@/lib/constants";
import { convertToMoney } from "@/lib/utils";
import { GetHonorariumsByRutResponse } from "@/services/honorariumServices";
import Table, { Row, Cell } from "@/components/common/Table/Table";
import { useState } from "react";

interface HonorariumRowProps {
  honorarium: Awaited<GetHonorariumsByRutResponse>[number];
}

export default function HonorariumRow({ honorarium }: HonorariumRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Row
        className="uppercase font-semibold cursor-pointer"
        key={honorarium.course.name}
        currentRow={honorarium.course.id}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Cell>{honorarium.course.name}</Cell>

        <Cell>
          <span
            className={`icon-[ci--chevron-down] text-gray-400 text-xl transition-transform ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </Cell>
      </Row>
      <Row className={`${expanded ? "" : "hidden"} `}>
        <Cell className="flex text-center gap-2">
          <div>
            <h3 className="uppercase font-semibold text-xs">
              Honorarios por función
            </h3>
            <Table
              headers={[
                { title: "Función" },
                { title: "Monto" },
                { title: "Fecha de pago" },
              ]}
            >
              {[
                ...honorarium.academic_honorarium,
                ...honorarium.responsible_honorarium,
              ].map((academicHonorarium) => (
                <Row
                  key={academicHonorarium.id}
                  currentRow={academicHonorarium.id}
                >
                  <Cell>
                    {
                      HONORARIUMS_FUNCTIONS_DICTIONARY[
                        academicHonorarium.function
                      ]
                    }
                  </Cell>
                  {academicHonorarium.payment.length > 0 ? (
                    <>
                      <Cell>
                        {convertToMoney(academicHonorarium.payment[0].amount)}
                      </Cell>
                      <Cell>
                        {new Date(
                          academicHonorarium.payment[0].payment_date
                        ).toLocaleDateString()}
                      </Cell>
                    </>
                  ) : (
                    <Cell colSpan={2} className="text-center">
                      {"No hay pagos recientes"}
                    </Cell>
                  )}
                </Row>
              ))}
            </Table>
          </div>
        </Cell>
      </Row>
    </>
  );
}
