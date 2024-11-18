interface SubtitlePageProps {
  children: React.ReactNode;
  className?: string;
}

export default function SubtitlePage({
  children,
  className,
}: SubtitlePageProps) {
  return (
    <h2 className={`text-3xl font-light ${className ? className : ""}`}>
      {children}
    </h2>
  );
}
