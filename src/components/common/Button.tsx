type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  return (
    <button
      className="bg-primary hover:brightness-90 text-white py-2 px-4 rounded w-full"
      {...props}
    >
      {props.children}
    </button>
  );
}
