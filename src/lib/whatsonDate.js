export function formatEventDateRange(start, end) {
  if (!start) return "";

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const format = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  // If both dates exist and are different
  if (endDate && startDate.toDateString() !== endDate.toDateString()) {
    return `${format(startDate)} - ${format(endDate)}`;
  }

  // Single-day event
  return format(startDate);
}

// export function formatEventDateRange(start, end) {
//   const s = new Date(start);
//   const e = end ? new Date(end) : null;

//   const opts = { year: "numeric", month: "long", day: "numeric" };

//   if (!e) {
//     return s.toLocaleDateString("en-US", opts);
//   }

//   return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString(
//     "en-US",
//     opts
//   )}`;
// }