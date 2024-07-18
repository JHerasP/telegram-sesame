export interface TaskWeek {
  startDate: string;
  endDate: string;
  days: TaskDay[];
  weeklyAccumulatedSeconds: number;
}

interface TaskDay {
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
