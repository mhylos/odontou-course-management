"use client";

import { academicSchema, AcademicSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FetchDropdown from "@/components/common/FetchDropdown";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import Checkbox from "@/components/common/Checkbox";
import { runFormatter, runToNumber } from "@/lib/utils";
import { createAcademic, updateAcademic } from "@/services/academicsServices";
import { toast } from "react-toastify";

interface AcademicFormProps {
  className?: string;
  defaultValues?: AcademicSchemaType;
  onClose?: () => void;
}

export default function AcademicForm({
  className,
  defaultValues,
  onClose,
}: AcademicFormProps) {
  const form = useForm<AcademicSchemaType>({
    defaultValues: {
      rut: "",
      name: "",
      email: "",
      department_fk: undefined,
      isFOUCH: false,
      ...defaultValues,
    },
    resolver: zodResolver(academicSchema),
  });

  const createOrUpdate = async (data: AcademicSchemaType) => {
    if (defaultValues) {
      return await updateAcademic(runToNumber(data.rut), data);
    } else {
      return await createAcademic(data);
    }
  };

  const onSubmit = async (data: AcademicSchemaType) => {
    try {
      const response = await createOrUpdate(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        if (onClose) onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={`flex flex-col gap-2 ${className}`}
      onSubmit={form.handleSubmit(onSubmit)}
      id={"academic-form"}
    >
      <FormFieldset legend="Datos personales">
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FloatingInput
              disabled={defaultValues?.rut !== undefined}
              label="RUT"
              error={error?.message}
              value={value}
              onChange={(value) => {
                const formatted = runFormatter(value.currentTarget.value);
                onChange(formatted);
              }}
            />
          )}
          name={"rut"}
          control={form.control}
        />
        <FloatingInput
          label="Nombre"
          {...form.register("name")}
          error={form.formState.errors.name?.message}
        />
        <FloatingInput
          label="Email"
          {...form.register("email")}
          error={form.formState.errors.email?.message}
        />
      </FormFieldset>
      <FormFieldset legend="Datos académicos">
        <FetchDropdown
          name="department_fk"
          label="Departamento perteneciente"
          control={form.control}
          fetchUrl="/api/department/options"
          fetchDefaultUrl={
            defaultValues?.department_fk
              ? `/api/department/options/${defaultValues.department_fk}`
              : undefined
          }
        />
        <Checkbox
          id="isFOUCH"
          label="Pertenece a la facultad"
          {...form.register("isFOUCH")}
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
        <Button type="submit" form="academic-form">
          Guardar
        </Button>
      </div>
    </form>
  );
}
