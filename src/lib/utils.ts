export function runFormatter(run: string) {
  const cleanedRun: string = run.replace(/[^0-9kK]/g, "").slice(0, 9);

  return cleanedRun.replace(
    /(\d{1,2})(\d{3})(\d{3})([0-9kK]{1})/,
    "$1.$2.$3-$4"
  );
}

export function convertToMoney(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value);
}

export function dublicateItems<T> (arr: Array<T>, numberOfRepetitions: number) {
  return arr.flatMap((i) => Array.from({ length: numberOfRepetitions }).fill(i));
}