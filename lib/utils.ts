import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatCategory(category: string) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function toTitleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function formatTimeLabel(time: string) {
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${minute} ${suffix}`;
}

export function buildDemoDate(time: string) {
  return `2026-04-16T${time}:00+06:00`;
}

export function lotAvailabilityTone(occupancyRate: number) {
  if (occupancyRate < 0.55) return "green";
  if (occupancyRate < 0.85) return "yellow";
  return "red";
}

export function minutesBetween(startIso: string, endIso: string) {
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
}
