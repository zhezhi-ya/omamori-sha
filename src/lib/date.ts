const shanghaiDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const shanghaiReadableFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "long",
  day: "numeric",
  weekday: "short",
});

export function getShanghaiDateKey(date = new Date()): string {
  return shanghaiDateFormatter.format(date);
}

export function getShanghaiReadableDate(date = new Date()): string {
  return shanghaiReadableFormatter.format(date);
}
