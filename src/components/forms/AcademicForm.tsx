"use client";

import { academicSchema, AcademicSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import Checkbox from "@/components/common/Checkbox";
import { runFormatter, runToNumber } from "@/lib/utils";
import { createAcademic, updateAcademic } from "@/services/academicsServices";
import { toast } from "react-toastify";
import AboutPassword from "@/components/common/AboutPassword";
import LoadingSpinner from "../common/LoadingSpinner";
import ResetFormButton from "./ResetFormButton";

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
      email: undefined,
      // department_fk: undefined,
      phone: undefined,
      isFOUCH: false,
      ...defaultValues,
    },
    resolver: zodResolver(academicSchema),
  });

  const isUpdate = defaultValues;

  const resetForm = () => {
    form.reset({
      name: "",
      email: "",
      phone: undefined,
      isFOUCH: false,
    });
    if (!isUpdate) {
      form.setValue("rut", "");
    }
  };

  const createOrUpdate = async (data: AcademicSchemaType) => {
    if (isUpdate) {
      return await updateAcademic(runToNumber(data.rut), data);
    } else {
      return await createAcademic(data);
    }
  };

  const onSubmit = async (data: AcademicSchemaType) => {
    try {
      return new Promise(async (resolve) => {
        const response = await createOrUpdate(data);
        toast(response.message, {
          type: response.success ? "success" : "error",
        });
        if (response.success) {
          if (onClose) onClose();
        }
        resolve(response);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <AboutPassword />
      <form
        className={`flex flex-col gap-2 ${className}`}
        onSubmit={form.handleSubmit(onSubmit)}
        id={"academic-form"}
      >
        <FormFieldset legend="Datos personales">
          <Controller
            disabled={defaultValues?.rut !== undefined}
            render={({ field, fieldState: { error } }) => (
              <FloatingInput
                {...field}
                label="RUT"
                error={error?.message}
                onChange={(value) => {
                  const formatted = runFormatter(value.currentTarget.value);
                  field.onChange(formatted);
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
          <Controller
            render={({ field, fieldState: { error } }) => (
              <FloatingInput
                {...field}
                value={field.value ?? ""}
                label="Número de teléfono"
                error={error?.message}
                onChange={(e) => {
                  const value = e.currentTarget.value.replace(/\D/g, "");

                  field.onChange(value);
                }}
              />
            )}
            name="phone"
            control={form.control}
          />
        </FormFieldset>
        <FormFieldset legend="Datos académicos">
          <Checkbox
            id="isFOUCH"
            label="Pertenece a la facultad"
            {...form.register("isFOUCH")}
          />
        </FormFieldset>

        <div className="flex gap-2 justify-center">
          {form.formState.isSubmitting ? (
            <LoadingSpinner />
          ) : (
            <>
              {onClose && (
                <Button
                  className="!bg-gray-500 !w-max"
                  onClick={onClose}
                  type="button"
                >
                  Volver
                </Button>
              )}
              <ResetFormButton type="button" onClick={resetForm} />
              <Button type="submit" form="academic-form">
                Guardar
              </Button>
            </>
          )}
        </div>
      </form>
    </>
  );
}
