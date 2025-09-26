"use client";

import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  buttonActionType?: "delete" | "edit" | "add";
}

export default function Button(props: ButtonProps) {
  let buttonTypeClassname = "";
  let buttonIcon = "";
  switch (props.buttonActionType) {
    case "delete":
      buttonTypeClassname = "bg-red-400";
      buttonIcon = "icon-[ph--trash]";
      break;
    case "edit":
      buttonTypeClassname = "bg-yellow-500";
      buttonIcon = "icon-[ph--pencil]";
      break;
    case "add":
      buttonTypeClassname = "bg-primary";
      buttonIcon = "icon-[ph--plus]";
      break;
    default:
      buttonTypeClassname = "bg-primary";
      break;
  }

  return (
    <button
      {...props}
      className={twMerge(
        "hover:brightness-90 text-white py-2 px-4 rounded w-full disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-300 hover:disabled:brightness-100",
        buttonTypeClassname,
        props.className
      )}
    >
      {props.buttonActionType && <span className={`${buttonIcon} text-xl`} />}
      {props.children}
    </button>
  );
}
