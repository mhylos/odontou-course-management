"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import { loginSchemaType, loginSchema } from "@/lib/zod";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { runFormatter } from "@/lib/utils";
import { loginAction } from "@/app/actions/auth-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { control } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginSchemaType) => {
    try {
      const response = await loginAction(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      router.push("/");
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
      <fieldset className="flex flex-col gap-10">
        <Controller
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Input
              label="RUT"
              errors={error}
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
              errors={error}
              onChange={onChange}
            />
          )}
          name={"password"}
          control={control}
        />
      </fieldset>
      <Button>Iniciar Sesión</Button>
    </Form>
  );
}
