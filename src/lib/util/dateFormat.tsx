export function formatToKST({ dateString }: { dateString: string }) {
  return new Date(new Date(dateString).getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);
}
