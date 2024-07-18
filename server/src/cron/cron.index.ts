import {
  startCronExpiringSession,
  startCronRememberToCheckIn,
  startCronAutoCheckOutMaxTime,
  startCronAutoCheckOut,
} from "./cron";

function runAllCron() {
  startCronExpiringSession();
  startCronAutoCheckOut();
  startCronRememberToCheckIn();
  startCronAutoCheckOutMaxTime();
}

const cronService = {
  runAllCron,
};

export { cronService };
