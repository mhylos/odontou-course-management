"use client";

import {
  academicParticipationSchema,
  academicParticipationSchemaType,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, SubmitErrorHandler, useForm } from "react-hook-form";
import FloatingInput from "../common/FloatingInput";
import FetchDropdown from "../common/FetchDropdown";
import FormFieldset from "./FormFieldset";
import Button from "../common/Button";
import BackButton from "../common/BackButton";
import { toast } from "react-toastify";
import { upsertAcademicParticipation } from "@/services/academicsServices";

interface AcademicParticipationFormProps {
  values?: academicParticipationSchemaType;
  courseId: number;
}

// function ErrorToast({ error, message }: { error: string; message?: string }) {
//   return (
//     <div className="flex flex-col">
//       <span className="font-bold">{error}</span>
//       <p className="text-sm">{message ?? ""}</p>
//     </div>
//   );
// }

export default function AcademicParticipationForm({
  values,
  courseId,
}: AcademicParticipationFormProps) {
  const form = useForm<academicParticipationSchemaType>({
    resolver: zodResolver(academicParticipationSchema),
    defaultValues: { ...values },
  });

  const onSubmit = async (data: academicParticipationSchemaType) => {
    try {
      let response = await upsertAcademicParticipation(courseId, data);
      toast(response.message, {
        type: response.success ? "success" : "error",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // const onError: SubmitErrorHandler<academicParticipationSchemaType> = (
  //   errors
  // ) => {
  //   const error = Object.values(errors).find((error) => error);
  //   if (error) {
  //     toast.error(
  //       <ErrorToast error={"Error en un campo"} message={error.message} />,
  //       { toastId: "error" }
  //     );
  //   }
  // };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormFieldset legend="Académico">
        <FetchDropdown
          label="Selección del académico"
          name="academic_fk"
          control={form.control}
          fetchUrl="/api/academics/options"
          selectedValue={values?.academic_fk}
          disabled={!!values}
          error={form.formState.errors.academic_fk?.message}
        />
      </FormFieldset>
      <FormFieldset legend="Datos de participación">
        <FetchDropdown
          label="Jerarquía académica"
          name="hierarchy_type_fk"
          control={form.control}
          fetchUrl="/api/hierarchy-types/options"
          selectedValue={values?.hierarchy_type_fk}
          error={form.formState.errors.hierarchy_type_fk?.message}
        />
        <div className="grid grid-cols-2 gap-2">
          <FloatingInput
            label="Horas de dedicación"
            type="number"
            {...form.register("dedicated_hours")}
          />
          <FloatingInput
            label="Horas de contrato"
            type="number"
            {...form.register("contract_hours")}
          />
        </div>
      </FormFieldset>
      <div className="flex gap-2 mt-2">
        <BackButton>
          <Button className="bg-gray-400">Cancelar</Button>
        </BackButton>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
