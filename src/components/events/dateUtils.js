export function formatEventRange(start, end) {
  if (!start) return "";

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const format = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
      timeZone: "UTC",
    });

  // If range and dates differ
  if (endDate && startDate.toDateString() !== endDate.toDateString()) {
    return `${format(startDate)} - ${format(endDate)}`;
  }

  // Single-day event
  return format(startDate);
}
