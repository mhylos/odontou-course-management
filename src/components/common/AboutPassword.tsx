export default function AboutPassword() {
  return (
    <div className="text-sm text-gray-500 flex items-center gap-2 py-2">
      <span className="icon-[ph--exclamation-mark-fill] text-4xl" />
      <p>
        La contraseña inicial para el usuario creado corresponde a los números
        del RUT, sin puntos ni dígito verificador.
      </p>
    </div>
  );
}
