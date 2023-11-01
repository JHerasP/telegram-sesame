import { awaitResolver } from "../../TS_tools/general-utility";
import { sendAutoCheckOut, sendPreviousAutoCheckOut } from "../Sesame-bot/sesame-actions";
import { User, sesameDatabase } from "../Sesame-database/SesameDatabase";
import { checkout, getEmployeeHolidays, getYearHolidays } from "../entity/sesame/sesame.service";
import { logConsole } from "../tools/log";
import { checkIfTodayIsHoliday, shouldAbortAutoCheckOut } from "./cron.tools";

export async function getRefreshedUserWorkingStatus(chatId: number) {
  await sesameDatabase.refreshWorkingStatus(chatId);
  return sesameDatabase.getUser(chatId);
}

export async function attemptToAutoCheckOut(user: User) {
  const shouldAbort = shouldAbortAutoCheckOut(user);

  if (shouldAbort) return;

  checkOutAndMessage(user).then(() => logConsole(user, "AutoClose"));
}

export async function checkIfWorkingDay(user: User) {
  const [employeeHolidays] = await awaitResolver(getEmployeeHolidays(user));
  const [yearHolidays] = await awaitResolver(getYearHolidays(user));

  if (!employeeHolidays || !yearHolidays) return false;

  const isHolyday = checkIfTodayIsHoliday(employeeHolidays.flat());
  const isYearHolyday = checkIfTodayIsHoliday(yearHolidays);

  return Boolean(!isHolyday && !isYearHolyday);
}

export async function checkOutAndMessage(user: User) {
  const [, err] = await awaitResolver(checkout(user));
  if (err) return;

  return sendAutoCheckOut(user.chatId);
}

export function sendMessageAboutCheckOutOutSession(user: User, extraTime: number) {
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + extraTime);

  sendPreviousAutoCheckOut(user.chatId, futureTime).then(() => logConsole(user, "Start auto check out", futureTime));
}
