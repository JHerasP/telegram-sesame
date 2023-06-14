export function checkHoliday(hollyDay: string[]) {
  const today = new Date();

  return hollyDay.some((day) => today.toISOString().includes(day));
}
