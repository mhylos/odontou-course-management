interface SectionProps {
  title: string;
}

export default function Section({ title }: SectionProps) {
  return (
    <div>
      <h3 className="text-2xl font-extralight">{title}</h3>
      <div>
        <h4 className="bg-secondary text-white px-2 py-1">Inicio</h4>
        <h4 className="bg-secondary text-white px-2 py-1">Termino</h4>
      </div>
    </div>
  );
}
