import { format, calculateDv } from "rutility";

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

export function restoreRun(run: number) {
  return format.dot(run.toString() + "-" + calculateDv(run.toString()));
}

export function capitalize(string: string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function convertToMoney(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(isFinite(value) ? value : 0);
}

export function dublicateItems<T>(arr: Array<T>, numberOfRepetitions: number) {
  return arr.flatMap((i) =>
    Array.from({ length: numberOfRepetitions }).fill(i)
  );
}

export function formatDate(date: string | Date) {
  try {
    const formatDate = new Date(date);

    return formatDate
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .reverse()
      .join("-");
  } catch (e) {
    return "";
  }
}

export function checkFileExtension(file: File, extensions: string[]) {
  if (!file) return;
  return extensions.includes(file.name.split(".").pop() || "");
}

export function isPercentage(value: string) {
  return value.trimEnd().endsWith("%");
}

export function adjustNumber(value: number, length: number) {
  const desiredLength = length;
  const currentLength = value.toString().length;

  if (currentLength < desiredLength) {
    const multiplier = Math.pow(10, desiredLength - currentLength);
    return value * multiplier;
  }
  return value; // If the length is already sufficient, do nothing
}

export const fetcher = (url: string | Request | URL) =>
  fetch(url).then((r) => r.json());

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
