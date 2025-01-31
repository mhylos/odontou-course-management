"use client";

import { changePasswordSchema, ChangePasswordSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import { changePassword } from "@/services/userServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";
import { twMerge } from "tailwind-merge";
import FormFieldset from "./FormFieldset";

interface NewPasswordFormProps {
  className?: string;
}

export default function NewPasswordForm({ className }: NewPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmNewPassword: "",
      newPassword: "",
      oldPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    const response = await changePassword(data.oldPassword, data.newPassword);
    toast(response.message, {
      type: response.success ? "success" : "error",
      toastId: "change-password",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge("flex flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-2">
        <FormFieldset legend="Contraseña actual">
          <FloatingInput
            label="Ingrese su contraseña actual"
            type="password"
            error={errors.oldPassword?.message}
            {...register("oldPassword")}
          />
        </FormFieldset>

        <FormFieldset legend="Nueva contraseña">
          <FloatingInput
            label="Ingrese su nueva contraseña"
            type="password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <FloatingInput
            label="Confirmar nueva contraseña"
            type="password"
            error={errors.confirmNewPassword?.message}
            {...register("confirmNewPassword")}
          />
        </FormFieldset>
      </div>
      {Object.values(errors).map((error) => (
        <p key={error.message} className="text-red-500 text-xs">
          * {error.message}
        </p>
      ))}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : "Guardar"}
      </Button>
    </form>
  );
}
