export function formatDateTimeKST({
  dateString,
}: {
  dateString: string | undefined;
}) {
  if (!dateString) {
    return "-";
  }
  const formattedDate = new Date(new Date(dateString).getTime())
    .toISOString()
    .replace("T", " ")
    .slice(0, 16);
  return formattedDate;
}

export function formatDateKST({
  dateString,
}: {
  dateString: string | undefined;
}) {
  if (!dateString) {
    return "-";
  }
  const formattedDate = new Date(new Date(dateString).getTime())
    .toISOString()
    .replace("T", " ")
    .slice(0, 16)
    .split(" ")[0];
  return formattedDate;
}

export function isEarlierDate(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  return d1 < d2;
}

export function isLaterDate(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  return d1 > d2;
}
export async function isEqual(
  date1: string | Date,
  date2: string | Date
): Promise<boolean> {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export async function isDateInRange(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): Promise<boolean> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const targetDate = new Date(date);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  return targetDate >= start && targetDate <= end;
}

export async function isDateTimeInRange(
  date: string | Date,
  startAt: string | Date,
  endAt: string | Date
): Promise<boolean> {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const time = new Date(date);

  return time >= start && time <= end;
}
