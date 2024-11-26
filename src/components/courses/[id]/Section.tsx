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
    <div className="relative w-full shadow flex-col content-end">
      <h3 className="text-2xl font-extralight absolute left-2 top-0 bg-white">
        {title}
      </h3>
      <div
        className={(
          "px-5 border-2 border-secondary pt-6 pb-6 rounded h-[calc(100%-1rem)] w-full " +
          className
        ).trimEnd()}
      >
        {children}
      </div>
    </div>
  );
}
