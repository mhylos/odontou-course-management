interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export default function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={`px-2 py-1 rounded-sm bg-gray-200 text-gray-800 text-sm ${
        className ? className : ""
      }`}
    >
      {children}
    </span>
  );
}
