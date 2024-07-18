import { awaitResolver } from "../TS_tools/general-utility";
import { tempChatHistory } from "../databases/SesameChatHistory";
import { User, sesameDatabase } from "../databases/SesameDatabase";
import { checkApi } from "../api/sesame/checks/check.index";
import { employeeApi } from "../api/sesame/employee/employee.index";
import { privateScreens } from "../telegram/telegram-screens";
import logConsole from "../telegram/tools/log";
import { checkIfTodayIsHoliday, shouldAbortAutoCheckOut } from "./cron.tools";

export async function getRefreshedUserWorkingStatus(chatId: number) {
  await sesameDatabase.refreshWorkingStatus(chatId);
  return sesameDatabase.getUser(chatId);
}

export async function attemptToAutoCheckOut(user: User) {
  const shouldAbort = shouldAbortAutoCheckOut(user);

  if (shouldAbort) return;

  checkOutAndMessage(user).then(() => {
    logConsole({ user, action: "AutoClose" });

    tempChatHistory.deleteChatHistory(user.chatId);
  });
}

export async function checkIfWorkingDay(user: User) {
  const [employeeHolidays] = await awaitResolver(employeeApi.getEmployeeHolidays(user));
  const [yearHolidays] = await awaitResolver(employeeApi.getYearHolidays(user));

  if (!employeeHolidays || !yearHolidays) return false;

  const isHolyday = checkIfTodayIsHoliday(employeeHolidays.flat());
  const isYearHolyday = checkIfTodayIsHoliday(yearHolidays);

  return Boolean(!isHolyday && !isYearHolyday);
}

export async function checkOutAndMessage(user: User) {
  const [, err] = await awaitResolver(checkApi.checkout(user));
  if (err) return;

  return privateScreens.sendAutoCheckOutMessage(user.chatId);
}

export function sendMessageAboutCheckOutOutSession(user: User, extraTime: number) {
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + extraTime);

  return privateScreens
    .sendAutoCheckOutWarningMessage(user.chatId, futureTime)
    .then(() => logConsole({ user, action: "startAutoCheckOut", autoCloseTime: futureTime }));
}
