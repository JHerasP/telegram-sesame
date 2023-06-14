export interface Holiday {
  id: string;
  name: string;
  date: string;
  seconds: number;
  startTime?: string;
  endTime?: string;
  holidayDayOff?: string;
  compensatedDayOff?: string;
  accumulatedSeconds: number;
  dayOffTimeType: string;
  workedHolidayId?: string;
}

export interface HolidaysResponse {
  data: {
    daysOff: Holiday[];
  }[];
}

export interface YearHolidayResponse {
  data: YearHoliday[];
}

export interface YearHoliday {
  id: string;
  name: string;
  date: string;
  seconds: number;
  startTime?: string;
  endTime?: string;
  holidayDayOff?: string;
  compensatedDayOff?: string;
  accumulatedSeconds?: string;
  dayOffTimeType: string;
  workedHolidayId?: string;
}
