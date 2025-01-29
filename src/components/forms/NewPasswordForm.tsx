import { changePasswordSchema, ChangePasswordSchemaType } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/common/Button";
import FloatingInput from "@/components/common/FloatingInput";
import { changePassword } from "@/services/userServices";
import { toast } from "react-toastify";
import LoadingSpinner from "../common/LoadingSpinner";

export default function NewPasswordForm() {
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
    const response = await changePassword(data.newPassword, data.oldPassword);
    toast(response.message, { type: response.success ? "success" : "error" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <FloatingInput
          label="Contraseña actual"
          type="password"
          error={errors.oldPassword?.message}
          {...register("oldPassword")}
        />
        <FloatingInput
          label="Nueva contraseña"
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
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner /> : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
