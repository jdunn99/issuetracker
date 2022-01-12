export function truncate(str: string, limit: number) {
  return str.length <= limit ? str : str.slice(0, limit) + "...";
}
