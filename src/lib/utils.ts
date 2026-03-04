type ClassValue = string | undefined | null | boolean;

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter((x): x is string => typeof x === "string" && x.length > 0)
    .join(" ");
}
