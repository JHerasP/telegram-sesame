import {createCron} from "./cron.tools";
import {autoCheckOut, checkExpiringSession, checkOutAtMaxWorkingTime, remmemberToCheckIn} from "./cront.actions";
import cronVariables from "./cront.variables";

const {everyWeekDayAfterWorkStartTimePassed, everyWeekDayAfterWorkEndtime, everyWeekDayMaxWorkingTime, onEveryDay} =
  cronVariables;

export function runCronExpiringSession() {
  createCron("Check expiring session", onEveryDay, checkExpiringSession);
}

export function startCronRememberToCheckIn() {
  createCron("Send message to check in", everyWeekDayAfterWorkStartTimePassed, remmemberToCheckIn);
}

export function startCronAutoCheckOut() {
  createCron("Auto check out after work end", everyWeekDayAfterWorkEndtime, autoCheckOut);
}

export function startCronAutoCheckOutMaxTime() {
  createCron("Check out at max working time", everyWeekDayMaxWorkingTime, checkOutAtMaxWorkingTime);
}
