export function formatToKST({
  dateString,
}: {
  dateString: string | undefined;
}) {
  if (!dateString) {
    return "-";
  }
  const formattedDate = new Date(
    new Date(dateString).getTime() + 9 * 60 * 60 * 1000
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);
  return formattedDate;
}
