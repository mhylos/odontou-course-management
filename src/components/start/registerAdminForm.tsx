"use client";

import { createAdminAction } from "@/app/actions/auth-actions";
import { runFormatter } from "@/lib/utils";
import { RegisterSchemaType, registerSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "@/components/common/FloatingInput";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function RegisterAdminForm() {
  const router = useRouter();
  const { control } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      const response = await createAdminAction(data);
      toast(response?.message, {
        type: response?.success ? "success" : "error",
      });

      if (response?.success) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      className="flex flex-col justify-between h-full"
      control={control}
      onSubmit={({ data }) => onSubmit(data)}
    >
      <fieldset className="flex flex-col gap-10 py-5">
        <Controller
          render={({ field: { onChange }, fieldState: { error } }) => (
            <Input label="Nombre" error={error?.message} onChange={onChange} />
          )}
          name={"name"}
          control={control}
        />
        <Controller
          render={({ field: { onChange }, fieldState: { error } }) => (
            <Input
              label="Correo electrónico"
              error={error?.message}
              onChange={onChange}
            />
          )}
          name={"email"}
          control={control}
        />
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="RUT"
              error={error?.message}
              value={value || ""}
              onChange={(value) => {
                const formatted = runFormatter(value.currentTarget.value);
                onChange(formatted);
              }}
            />
          )}
          name={"rut"}
          control={control}
        />
        <Controller
          render={({ field: { onChange }, fieldState: { error } }) => (
            <Input
              label="Contraseña"
              type="password"
              error={error?.message}
              onChange={onChange}
            />
          )}
          name={"password"}
          control={control}
        />
      </fieldset>
      <Button>Crear</Button>
    </Form>
  );
}
