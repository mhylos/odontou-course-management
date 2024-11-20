interface SectionItemProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionItem({ title, children }: SectionItemProps) {
  return (
    <div>
      <h4 className="bg-secondary rounded w-max text-white px-2 py-1">
        {title}
      </h4>
      {children}
    </div>
  );
}
