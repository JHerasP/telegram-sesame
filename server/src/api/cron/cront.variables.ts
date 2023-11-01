const cronVariables = {
  minRandomTime: 1 * 60 * 1000,
  maxRandomTime: 7 * 60 * 1000,

  onEveryDay: "0 12 * * *",
  everyWeekDayAfterWorkEndtime: "10 15 * * 1-5",
  everyDayAfterWorkStartTimePassed: "10 7 * * 1-5",
  everyWeekDayMaxWorkingTime: "29 15 * * 1-5",
};

export default cronVariables;
