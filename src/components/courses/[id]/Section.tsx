interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Section({
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <div className="relative w-full">
      <h3 className="text-2xl font-extralight absolute left-2 -top-4 bg-white">
        {title}
      </h3>
      <div
        className={(
          "px-5 border-2 border-secondary pt-6 pb-6 rounded " + className
        ).trimEnd()}
      >
        {children}
      </div>
    </div>
  );
}
