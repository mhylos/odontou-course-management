import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
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
      className={
        `hover:brightness-90 text-white py-2 px-4 rounded w-full` +
        ` ${props.className} ${buttonTypeClassname}`
      }
    >
      {props.buttonActionType && <span className={`${buttonIcon} text-xl`} />}
      {props.children}
    </button>
  );
}
