import cron from "node-cron";
import { User, sesameDatabase } from "../Sesame-database/SesameDatabase";
import { sendAutoCheckOut, sendPreviousAutoCheckOut } from "../Sesame-bot/sesame-actions";
import { logConsole } from "../tools/log";
import { awaitResolver } from "../../TS_tools/general-utility";
import { checkout, getEmployeeHolidays, getYearHolidays } from "../entity/sesame/sesame-service";

export function checkHoliday(hollyDay: string[]) {
  const today = new Date();

  return hollyDay.some((day) => today.toISOString().includes(day));
}

export function isSameDay(until: Date, today: Date) {
  return until.getMonth() === today.getMonth() && until.getDate() === today.getDate();
}

export function waitUntil(until: number, callback: VoidFunction) {
  setTimeout(callback, until);
}

export function createCron(name: string, cronExpression: string, callback: VoidFunction) {
  cron.schedule(cronExpression, () => callback(), { name, timezone: "Europe/Madrid" });
}

export function getRandomTime(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getActualizedWorkingStatusUser(chatId: number) {
  await sesameDatabase.refreshWorkingStatus(chatId);
  return sesameDatabase.getUser(chatId);
}

export function sendMessageAboutCheckingOut(user: User, extraTime: number) {
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + extraTime);

  sendPreviousAutoCheckOut(user.chatId, futureTime).then(() => logConsole(user, "Start auto check out", futureTime));
}

export async function attemptToAutoCheckOut(user: User) {
  const shouldAbort = shouldAbortAutoCheckOut(user);

  if (shouldAbort) return;

  checkOutAndMessage(user).then(() => logConsole(user, "AutoClose"));
}

function shouldAbortAutoCheckOut(user: User) {
  const rejected = sesameDatabase.getUser(user.chatId)?.rejectedAutoCheckOut;

  if (rejected) {
    logConsole(user, "Abort autoclose");
    sesameDatabase.toogleInminentAutoclose(user.chatId, false);
  }

  return Boolean(rejected);
}

export async function checkIfWorkingDay(user: User) {
  const [employeeHolidays] = await awaitResolver(getEmployeeHolidays(user));
  const [yearHolidays] = await awaitResolver(getYearHolidays(user));

  if (!employeeHolidays || !yearHolidays) return false;

  const isHolyday = checkHoliday(employeeHolidays.flat());
  const isYearHolyday = checkHoliday(yearHolidays);

  return Boolean(!isHolyday && !isYearHolyday);
}

export async function checkOutAndMessage(user: User) {
  const [, err] = await awaitResolver(checkout(user));
  if (err) return;

  return sendAutoCheckOut(user.chatId);
}
