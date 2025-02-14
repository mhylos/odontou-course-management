import { twMerge } from "tailwind-merge";

export default function LoadingSpinner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        `icon-[line-md--loading-loop] text-2xl text-primary`,
        className
      )}
    />
  );
}
