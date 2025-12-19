export function formatEventDate(start, end) {
  const s = new Date(start);
  const e = end ? new Date(end) : null;

  const suffix = d =>
    d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd"][d % 10] || "th";

  const day1 = s.getDate();
  const month = s.toLocaleString("en", { month: "short" });
  const year = s.getFullYear().toString().slice(-2);

  if (!e) return `${day1}${suffix(day1)} ${month} ${year}`;

  const day2 = e.getDate();
  return `${day1}${suffix(day1)} – ${day2}${suffix(day2)} ${month} ${year}`;
}
