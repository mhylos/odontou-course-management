"use client";

import { convertToMoney, restoreRun } from "@/lib/utils";
import Section from "@/components/cursos/detalles/[id]/Section";
import Decimal from "decimal.js";
import { Control, useForm, useWatch } from "react-hook-form";
import {
  AcademicHonorariumSchemaType,
  HonorariumsSchemaType,
  ResponsibleHonorariumSchemaType,
} from "@/lib/zod";
import { useEffect } from "react";
import Button from "@/components/common/Button";
import AcademicsHonorariumsTable from "./AcademicsHonorariumsTable";
import ResponsibleHonorariumTable from "./ResponsibleHonorariumsTable";
import { toast } from "react-toastify";
import { updateAcademicsHonorariums } from "@/services/honorariumServices";

interface HonorariumFormProps {
  totalHonorariums: string;
  academicsHonorariums: AcademicHonorariumSchemaType[];
  responsiblesHonorariums: ResponsibleHonorariumSchemaType[];
  courseId: number;
}

function getTotalToDistribute(
  control: Control<HonorariumsSchemaType>,
  academicHonorarium: string
) {
  const percentages = useWatch({
    name: "responsiblesHonorariums",
    control,
  });

  let totalToDistribute = new Decimal(academicHonorarium);

  percentages.forEach((percentage, i) => {
    const value = new Decimal(percentage.percentage || 0)
      .div(100)
      .times(totalToDistribute);
    totalToDistribute = totalToDistribute.sub(value);
  });
  return totalToDistribute;
}

function getTotalHours(control: Control<HonorariumsSchemaType>) {
  const honorariums = useWatch({ name: "academicsHonorariums", control });

  return honorariums.reduce(
    (acc, field) =>
      acc.plus(
        field.functions.reduce(
          (acc, field) => acc.plus(field.hours || 0),
          new Decimal(0)
        )
      ),
    new Decimal(0)
  );
}

export default function HonorariumForm({
  totalHonorariums,
  academicsHonorariums,
  responsiblesHonorariums,
  courseId,
}: HonorariumFormProps) {
  const {
    control,
    register,
    reset,
    handleSubmit,

    formState: { isDirty, isSubmitting, isSubmitted },
  } = useForm<HonorariumsSchemaType>({
    defaultValues: {
      academicsHonorariums: academicsHonorariums,
      responsiblesHonorariums: responsiblesHonorariums,
    },
  });

  const totalToDistribute = getTotalToDistribute(control, totalHonorariums);

  const totalHours = getTotalHours(control);

  const hourValue = totalToDistribute.div(totalHours);

  const onSubmit = async (data: HonorariumsSchemaType) => {
    return new Promise(() => {
      setTimeout(() => {
        updateAcademicsHonorariums(courseId, data.academicsHonorariums);
        toast.update("save-changes-toast", {
          isLoading: false,
          type: "success",
          render: "Cambios guardados",
          autoClose: 1000,
        });
      }, 1000);
    });
  };

  useEffect(() => {
    if (isDirty && !isSubmitting) {
      toast(
        <div>
          <p>¿Desea guardar los cambios?</p>
          <div className="flex gap-2 justify-center mt-2">
            <Button type="submit" form="honorarium-form">
              Guardar
            </Button>
            <Button className="!bg-gray-500" onClick={() => reset()}>
              Deshacer
            </Button>
          </div>
        </div>,
        { autoClose: false, toastId: "save-changes-toast", closeButton: false }
      );
    } else {
      if (isSubmitting) {
        toast.update("save-changes-toast", {
          isLoading: true,
          render: "Guardando cambios...",
        });
      } else toast.dismiss("save-changes-toast");
      if (isSubmitted) {
        toast.update("save-changes-toast", {
          type: "success",
          render: "Cambios guardados",
        });
      }
    }
  }, [isDirty, isSubmitting]);

  return (
    <form
      className="grid grid-cols-[3fr_1fr] grid-rows-[1.2fr_1fr_3fr] gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
      id="honorarium-form"
    >
      <div className="row-span-2">
        <Section
          title="Honorarios administrativos"
          containerClassname="h-full"
          className=""
        >
          <ResponsibleHonorariumTable
            control={control}
            totalToDistribute={totalToDistribute}
          />
        </Section>
      </div>
      <Section title="Distribución de honorarios" containerClassname="h-full">
        <div className="grid grid-cols-2 grid-rows-[max-content] gap-y-1 gap-x-2 font-extralight text-center text-sm">
          <span className="text-2xl font-light text-center self-center">
            {convertToMoney(parseInt(totalHonorariums))}
          </span>
          <span className="text-2xl font-light text-center self-center">
            {convertToMoney(totalToDistribute.toNumber())}
          </span>
          <span>Honorarios académicos</span>
          <span>Total a distribuir</span>
        </div>
      </Section>

      <Section
        title="Valor hora"
        containerClassname="h-full"
        className="overflow-hidden"
      >
        <div className="grid grid-cols-3 place-items-center w-max text-center self-center">
          <span className="font-extralight text-sm">Total a distribuir</span>
          <span className="row-span-2 icon-[iconamoon--sign-division-slash-thin] text-4xl" />
          <span className="font-extralight text-sm">Horas totales</span>
          <span className="text-xl font-light overflow-hidden max-w-[5rem]">
            {convertToMoney(totalToDistribute.toNumber())}
          </span>
          <span className="text-xl font-light max-w-[5rem]">
            {totalHours.toString()}
          </span>
        </div>
        <span className="text-3xl font-light">
          {convertToMoney(hourValue.toNumber())}
        </span>
      </Section>

      <div className="col-span-2 overflow-auto h-full">
        <Section title="Honorarios académicos" containerClassname="h-full">
          <AcademicsHonorariumsTable
            control={control}
            register={register}
            hourValue={hourValue}
          />
        </Section>
      </div>
    </form>
  );
}
