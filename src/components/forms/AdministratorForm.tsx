"use client";

import AboutPassword from "@/components/common/AboutPassword";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import FormFieldset from "@/components/forms/FormFieldset";
import { fetcher, runFormatter, runToNumber } from "@/lib/utils";
import { adminSchema, AdminSchemaType } from "@/lib/zod";
import { createAdmin } from "@/services/adminServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

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

  const rut = useDebounce(form.watch("rut"), 500)[0];

  const { data: fetchedUser, isLoading } = useSWR(
    rut ? `/api/admins/${String(runToNumber(rut))}` : null,
    fetcher
  );

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

  useEffect(() => {
    if (fetchedUser) {
      form.setValue("name", fetchedUser.name);
      form.setValue("email", fetchedUser.email);
    }
  }, [fetchedUser, form]);

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
          <Controller
            render={({ field: { value, onChange } }) => (
              <FloatingInput
                label="Nombre"
                value={value}
                onChange={onChange}
                disabled={isLoading || !!fetchedUser}
              />
            )}
            name="name"
            control={form.control}
          />
          <Controller
            render={({ field: { value, onChange } }) => (
              <FloatingInput
                label="Correo electrónico"
                value={value}
                onChange={onChange}
                disabled={isLoading || !!fetchedUser}
              />
            )}
            name="email"
            control={form.control}
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
