type DateRangeItem = {
  startDate: string | null;
  endDate: string | null;
  isCurrent?: boolean;
};

export function formatDateRange(item: DateRangeItem) {
  const start = formatMonth(item.startDate);
  const end = item.isCurrent ? "至今" : formatMonth(item.endDate);

  return [start, end].filter(Boolean).join(" - ") || "时间未填写";
}

export function formatMonth(date: string | null) {
  if (!date) {
    return null;
  }

  const [year, month] = date.split("-");

  if (!year) {
    return date;
  }

  return month ? `${year}.${month}` : year;
}

export function getInitials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}
