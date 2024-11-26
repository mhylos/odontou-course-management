import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={
        "bg-primary hover:brightness-90 text-white py-2 px-4 rounded w-full" +
        (props.className ? ` ${props.className}` : "")
      }
    >
      {props.children}
    </button>
  );
}
