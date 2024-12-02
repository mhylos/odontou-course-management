import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  buttonType?: "delete" | "edit" | "add";
}

export default function Button(props: ButtonProps) {
  let buttonTypeClassname = "";
  let buttonIcon = "";
  switch (props.buttonType) {
    case "delete":
      buttonTypeClassname = "bg-delete";
      buttonIcon = "icon-[ph--trash]";
      break;
    case "edit":
      buttonTypeClassname = "bg-edit";
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
      {props.buttonType && <span className={`${buttonIcon} text-xl`} />}
      {props.children}
    </button>
  );
}
