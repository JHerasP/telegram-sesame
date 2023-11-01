export type SesameEmployee = {
  id: string;
  workStatus: string;
};

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

export interface WorkType {
  id: string;
  name: string;
  color: string;
  icon: string;
  countEmployees: number;
  assignmentType: string;
  createdBy: null;
  allCompany: boolean;
  workType: string;
  status: string;
  workCheckTypeConfiguration: {
    id: string;
    maxHours: boolean;
    blockHours: boolean;
    blockDays: boolean;
    blockDates: boolean;
    totalMaxHours: null;
    period: null;
    notAllowedHoursRanges: null;
    notAllowedDaysRanges: null;
    notAllowedDatesRanges: null;
    hoursAvailable: null;
    autoCheckOutConfiguration: null;
  };
  blocked: boolean;
  workCheckTypeUsed: boolean;
}
