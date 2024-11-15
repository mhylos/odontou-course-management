interface TitlePageProps {
  children: React.ReactNode;
  className?: string;
}

export default function TitlePage({ children, className }: TitlePageProps) {
  return (
    <h1 className={`text-5xl font-light ${className ? className : ""}`}>
      {children}
    </h1>
  );
}
