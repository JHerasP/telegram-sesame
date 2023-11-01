import { HolidaysResponse } from "./employee.types";

export function getDaysOff(holidays: HolidaysResponse) {
  return holidays.data.map((holiday) => {
    if (!holiday) return [];

    return holiday.daysOff.map((day) => day.date ?? "");
  });
}
