interface SectionItemProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionItem({
  title,
  children,
  className = "",
}: SectionItemProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`.trimEnd()}>
      <h4 className="bg-secondary rounded w-max text-white px-2 py-1">
        {title}
      </h4>
      {children}
    </div>
  );
}
