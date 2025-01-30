"use client";

import { restartPassword } from "@/services/userServices";
import ActionRowButton from "./ActionRowButton";
import { toast } from "react-toastify";

interface RestartPasswordButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  rut: number;
}

export default function RestartPasswordButton({
  rut,
  ...props
}: RestartPasswordButtonProps) {
  const handleClick = async () => {
    if (
      confirm(
        "¿Está seguro de que desea reiniciar la contraseña de este usuario?"
      )
    ) {
      const response = await restartPassword(rut);

      toast(response.message, { type: response.success ? "success" : "error" });
    }
  };

  return (
    <ActionRowButton
      {...props}
      className="max-w-max text-xl bg-secondary"
      onClick={handleClick}
    >
      <span className="icon-[ph--lock-key-open] " />
    </ActionRowButton>
  );
}
