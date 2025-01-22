"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import { LoginSchemaType, loginSchema } from "@/lib/zod";
import Button from "@/components/common/Button";
import Input from "@/components/common/FloatingInput";
import { runFormatter } from "@/lib/utils";
import { loginAction } from "@/app/actions/auth-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const response = await loginAction(data);
      toast(response.message, { type: response.success ? "success" : "error" });
      router.push("/");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
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
              error={error?.message}
              value={value || ""}
              disabled={isLoading}
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
              disabled={isLoading}
              onChange={onChange}
            />
          )}
          name={"password"}
          control={control}
        />
      </fieldset>
      <Button disabled={isLoading}>
        {isLoading ? (
          <span className="icon-[line-md--loading-loop]" />
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </Form>
  );
}
