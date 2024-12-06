interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isFetching?: boolean;
}

export default function Section({
  title,
  children,
  className = "",
  isFetching = false,
}: SectionProps) {
  return (
    <div
      className={`relative w-full flex-col content-end ${
        isFetching ? "animate-pulse" : ""
      }`.trimEnd()}
    >
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
      {isFetching && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded"></div>
      )}
    </div>
  );
}
