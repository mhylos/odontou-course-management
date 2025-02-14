"use client";

import {
  academicParticipationSchema,
  AcademicParticipationSchemaType,
} from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FloatingInput from "../common/FloatingInput";
import FetchDropdown from "../common/FetchDropdown";
import FormFieldset from "@/components/forms/FormFieldset";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { upsertAcademicParticipation } from "@/services/academicsServices";
import AcademicForm from "@/components/forms/AcademicForm";
import { useState } from "react";
import { useSWRConfig } from "swr";
import LoadingSpinner from "../common/LoadingSpinner";

interface AcademicParticipationFormProps {
  values?: AcademicParticipationSchemaType;
  courseId: number;
}

export default function AcademicParticipationForm({
  values,
  courseId,
}: AcademicParticipationFormProps) {
  const form = useForm<AcademicParticipationSchemaType>({
    resolver: zodResolver(academicParticipationSchema),
    defaultValues: { ...values },
  });
  const [createAcademic, setCreateAcademic] = useState(false);
  const { mutate } = useSWRConfig();

  const onSubmit = async (data: AcademicParticipationSchemaType) => {
    try {
      return new Promise(async (resolve) => {
        const response = await upsertAcademicParticipation(courseId, data);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        if (response.success) {
          form.reset();
        }
        resolve(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormClose = () => {
    mutate("/api/academics/options");
    setCreateAcademic(false);
  };

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={createAcademic ? "hidden" : ""}
      >
        <FormFieldset legend="Académico">
          <FetchDropdown
            label="Selección del académico"
            name="academic_fk"
            control={form.control}
            fetchUrl="/api/academics/options"
            fetchDefaultUrl={
              values
                ? `/api/academics/options/${values.academic_fk}`
                : undefined
            }
            disabled={!!values}
            error={form.formState.errors.academic_fk?.message}
            create={() => setCreateAcademic(true)}
          />
        </FormFieldset>
        <FormFieldset legend="Datos de participación">
          <FetchDropdown
            label="Jerarquía académica"
            name="hierarchy_type_fk"
            control={form.control}
            fetchUrl="/api/hierarchy-types/options"
            fetchDefaultUrl={
              values
                ? `/api/hierarchy-types/options/${values.hierarchy_type_fk}`
                : undefined
            }
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
          {/* <BackButton href="">
            <Button className="!bg-gray-500">Cancelar</Button>
          </BackButton> */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <LoadingSpinner className="text-gray-500" />
            ) : (
              "Guardar"
            )}
          </Button>
        </div>
      </form>
      {createAcademic && <AcademicForm onClose={handleFormClose} />}
    </>
  );
}
