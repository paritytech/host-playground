import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

export function truncateHash(hash: string, start = 10, end = 8): string {
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function stringify(value: unknown): string {
  return JSON.stringify(
    value,
    (_, v) => {
      if (v instanceof Uint8Array) {
        return Array.from(v)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
      if (typeof v === "bigint") return v.toString();
      return v;
    },
    2,
  );
}
