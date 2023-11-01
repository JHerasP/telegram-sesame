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

export interface TaskWeek {
  startDate: string;
  endDate: string;
  days: TaskDay[];
  weeklyAccumulatedSeconds: number;
}

export interface TaskDay {
  dailyAccumulatedSeconds: number;
  date: string;
  timers: TaskTimer[];
}

export interface TaskTimer {
  id: string;
  employeeId: string;
  employee: null;
  projectId: string;
  project: [];
  tagIds: [];
  tags: [];
  timerIn: [];
  timerOut: [];
  comment: string;
  accumulatedSeconds: number;
  openedSeconds: number;
  createdAt: string;
  updatedAt: string;
  plannedTask: null;
}
