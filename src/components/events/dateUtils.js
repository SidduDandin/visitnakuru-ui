export function formatEventRange(start, end) {
  const s = new Date(start);
  const e = end ? new Date(end) : null;

  const day1 = s.getUTCDate();
  const day2 = e?.getUTCDate();

  const month = s.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC"
  });

  const year = s.toLocaleString("en-US", {
    year: "2-digit",
    timeZone: "UTC"
  });

  return e
    ? `${day1}th - ${day2}th\n${month} ${year}`
    : `${day1}th\n${month} ${year}`;
}
