export function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// "snippet" → "Snippets"
export function formatTypeName(name: string) {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;
}
