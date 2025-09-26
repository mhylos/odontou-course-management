"use client";

import { createDepartmentSchema, CreateDepartmentSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FetchDropdown from "@/components/common/FetchDropdown";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import {
  createDepartment,
  updateDepartment,
} from "@/services/departmentServices";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
interface DepartmentFormProps {
  className?: string;
  initialValues?: CreateDepartmentSchemaType;
  onClose?: () => void;
}

export default function DepartmentForm({
  className,
  initialValues,
  onClose,
}: DepartmentFormProps) {
  const { departmentId } = useParams<{ departmentId: string }>();
  const { handleSubmit, register, reset, formState, control } =
    useForm<CreateDepartmentSchemaType>({
      defaultValues: initialValues,
      resolver: zodResolver(createDepartmentSchema),
    });

  const createOrUpdateDepartment = async (data: CreateDepartmentSchemaType) => {
    if (departmentId) {
      return await updateDepartment(Number(departmentId), data);
    } else {
      return await createDepartment(data);
    }
  };

  const onSubmit = async (data: CreateDepartmentSchemaType) => {
    const response = await createOrUpdateDepartment(data);
    try {
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        reset(data);
        if (onClose) onClose();
        return;
      }
    } catch (error) {
      console.error(error);
      toast("Ocurrió un error inesperado", { type: "error" });
    }
  };

  return (
    <form
      className={`flex flex-col gap-2 ${className}`}
      onSubmit={handleSubmit(onSubmit)}
      id="department-form"
    >
      <FormFieldset legend="Departamento">
        <FloatingInput
          label="Nombre"
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <Controller
          name="director_fk"
          control={control}
          render={({
            field: { value, name, onChange },
            fieldState: { error },
          }) => (
            <FetchDropdown
              id={name}
              label="Director del departamento"
              fetchUrl="/api/academics/options"
              fetchDefaultUrl={`/api/academics/options/${initialValues?.director_fk}`}
              error={error?.message}
              selectedValue={value ?? undefined}
              onChange={(option) => {
                onChange(option?.value);
              }}
            />
          )}
        />
      </FormFieldset>

      <div className="flex gap-2">
        {onClose && (
          <Button
            className="!bg-gray-500 !w-max"
            onClick={onClose}
            type="button"
          >
            Volver
          </Button>
        )}
        <Button type="submit" form="department-form">
          Guardar
        </Button>
      </div>
    </form>
  );
}
