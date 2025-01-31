"use client";

import { adminSchema, AdminSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import { runFormatter } from "@/lib/utils";
import { createAdmin } from "@/services/adminServices";
import { toast } from "react-toastify";
import AboutPassword from "@/components/common/AboutPassword";

interface AdministratorFormProps {
  className?: string;
  onClose?: () => void;
}

export default function AdministratorForm({
  className,

  onClose,
}: AdministratorFormProps) {
  const form = useForm<AdminSchemaType>({
    defaultValues: {
      rut: "",
      name: "",
      email: "",
    },
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminSchemaType) => {
    try {
      const response = await createAdmin(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      if (response.success) {
        if (onClose) onClose();
      }
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
        id={"administrator-form"}
      >
        <FormFieldset legend="Datos personales">
          <Controller
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FloatingInput
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
          <Button type="submit" form="administrator-form">
            Guardar
          </Button>
        </div>
      </form>
    </>
  );
}
