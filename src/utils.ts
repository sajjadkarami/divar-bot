export function truncate(text: string, maxLength = 1024): string {
  return text.length > maxLength ? text.substring(0, maxLength) : text;
}
