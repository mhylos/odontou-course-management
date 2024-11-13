interface TitlePageProps {
  children: React.ReactNode;
}

export default function TitlePage({ children }: TitlePageProps) {
  return <h1 className="text-5xl font-light">{children}</h1>;
}
