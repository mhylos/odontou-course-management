export default function LoadingSpinner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <span
      className={`icon-[line-md--loading-loop] text-2xl text-primary ${className}`.trimEnd()}
    />
  );
}
