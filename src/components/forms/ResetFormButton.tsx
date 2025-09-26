import Button from "@/components/common/Button";
import { ButtonHTMLAttributes } from "react";

interface ResetFormButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function ResetFormButton(props: ResetFormButton) {
  return (
    <Button
      type="reset"
      className="bg-transparent border-slate-500 border-2 text-slate-700 hover:bg-slate-100 w-max"
      {...props}
    >
      {props.children ?? "Reiniciar"}
    </Button>
  );
}
