export function runFormatter(run: string) {
  const cleanedRun: string = run.replace(/[^0-9kK]/g, "").slice(0, 9);

  return cleanedRun.replace(
    /(\d{1,2})(\d{3})(\d{3})([0-9kK]{1})/,
    "$1.$2.$3-$4"
  );
}
