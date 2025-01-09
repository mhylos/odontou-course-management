"use client";

import FloatingInput from "@/components/common/FloatingInput";
import { convertToMoney } from "@/lib/utils";
import { honorariumsSchemaType } from "@/lib/zod";
import Decimal from "decimal.js";
import { Control, Controller, useWatch } from "react-hook-form";

interface DirectorCoordinatorInputProps {
  academicHonorarium: string;
  control: Control<honorariumsSchemaType>;
}

function Amount({
  control,
  academicHonorarium,
  type,
}: {
  control: Control<honorariumsSchemaType>;
  academicHonorarium: string;
  type: "director_percentage" | "coordinator_percentage";
}) {
  const percentage = useWatch({ name: type, control });

  const percentageValue = new Decimal(percentage || 0).div(100);
  return (
    <span className="grid place-content-center text-gray-500 text-xs">
      {convertToMoney(
        Decimal.mul(academicHonorarium, percentageValue).toNumber()
      )}
    </span>
  );
}

export default function DirectorCoordinatorInput({
  academicHonorarium,
  control,
}: DirectorCoordinatorInputProps) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-1">
        <div className="relative">
          <Controller
            name="director_percentage"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FloatingInput
                label="Director"
                value={value || ""}
                onChange={(e) => {
                  let value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                  let n = new Decimal(value || 0);
                  if (n.greaterThan("100") || n.lessThan("0")) {
                    return;
                  }

                  onChange(value ?? 0);
                }}
              />
            )}
          />
          <span className="absolute my-auto bottom-2 right-2 text-gray-500 select-none">
            %
          </span>
        </div>
        <Amount
          academicHonorarium={academicHonorarium}
          control={control}
          type="director_percentage"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="relative">
          <Controller
            name="coordinator_percentage"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FloatingInput
                label="Coordinador"
                value={value || ""}
                onChange={(e) => {
                  let value = e.currentTarget.value.replace(/[^0-9.]/g, "");
                  let n = new Decimal(value || 0);
                  if (n.greaterThan("100") || n.lessThan("0")) {
                    return;
                  }

                  onChange(value ?? 0);
                }}
              />
            )}
          />
          <span className="absolute my-auto bottom-2 right-2 text-gray-500 select-none">
            %
          </span>
        </div>
        <Amount
          academicHonorarium={academicHonorarium}
          control={control}
          type="coordinator_percentage"
        />
      </div>
    </div>
  );
}
