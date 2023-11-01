import {
  runCronExpiringSession,
  startCronRememberToCheckIn,
  startCronAutoCheckOutMaxTime,
  startCronAutoCheckOut,
} from "./cron";

function runAllCron() {
  runCronExpiringSession();
  startCronAutoCheckOut();
  startCronRememberToCheckIn();
  startCronAutoCheckOutMaxTime();
}

const cronService = {
  runAllCron,
};

export { cronService };
