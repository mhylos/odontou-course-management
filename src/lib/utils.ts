import { format } from "rutility";

export function runFormatter(run: string) {
  const cleanedRun: string = run.replace(/[^0-9kK]/g, "").slice(0, 9);

  return cleanedRun.replace(
    /(\d{1,2})(\d{3})(\d{3})([0-9kK]{1})/,
    "$1.$2.$3-$4"
  );
}

export function runToNumber(run: string) {
  return parseInt(format.notDotDash(run));
}

export function convertToMoney(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(value);
}

export function dublicateItems<T>(arr: Array<T>, numberOfRepetitions: number) {
  return arr.flatMap((i) =>
    Array.from({ length: numberOfRepetitions }).fill(i)
  );
}

export function formatDate(date: string | Date): string {
  try {
    const formatDate = new Date(date);

    const day = String(formatDate.getDate()).padStart(2, "0");
    const month = String(formatDate.getMonth() + 1).padStart(2, "0");
    const year = formatDate.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (e) {
    return "No definido" + e;
  }
}

export const fetcher = (url: string | Request | URL) =>
  fetch(url).then((r) => r.json());
