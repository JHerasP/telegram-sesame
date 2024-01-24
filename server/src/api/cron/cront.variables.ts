const cronVariables = {
  minRandomTime: 2 * 60 * 1000,
  maxRandomTime: 4 * 60 * 1000,

  onEveryDay: "0 12 * * *",
  everyWeekDayAfterWorkEndtime: "10 15 * * 1-5",
  everyWeekDayAfterWorkStartTimePassed: "10 7 * * 1-5",
  everyWeekDayMaxWorkingTime: "29 15 * * 1-5",
} as const;

export default cronVariables;
