import { sendRemberCheckIn, sendRenewLogIn } from "../Sesame-bot/sesame-actions";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { logConsole } from "../tools/log";
import {
  attemptToAutoCheckOut,
  checkIfWorkingDay,
  checkOutAndMessage,
  getRefreshedUserWorkingStatus,
  sendMessageAboutCheckOutOutSession,
} from "./cron.service";
import { getRandomTimeInterval, isSameDay, waitUntil } from "./cron.tools";
import cronVariables from "./cront.variables";

const { minRandomTime, maxRandomTime } = cronVariables;

export function checkExpiringSession() {
  const today = new Date();
  const users = sesameDatabase.getAllUsers();
  if (!users.size) return;

  users.forEach(({ chatId, logUntil }) => isSameDay(logUntil, today) && sendRenewLogIn(chatId, logUntil));
}

export function remmemberToCheckIn() {
  const users = sesameDatabase.getAllUsers();
  if (!users.size) return;

  users.forEach(async (_, chatId) => {
    const user = await getRefreshedUserWorkingStatus(chatId);

    if (!user) return;
    if (!user.remmeberCheckIn) return;
    if (user.workingStatus !== "offline") return;

    const workingDay = await checkIfWorkingDay(user);

    if (workingDay) sendRemberCheckIn(chatId).then(() => logConsole(user, "Remember to check in"));
  });
}

export function autoCheckOut() {
  const users = sesameDatabase.getAllUsers();
  if (!users.size) return;

  users.forEach(async ({ chatId, autoCheckOut }) => {
    if (!autoCheckOut) return;

    const user = await getRefreshedUserWorkingStatus(chatId);
    if (!user) return;
    if (user.workingStatus === "offline") return;

    const randomTime = getRandomTimeInterval(minRandomTime, maxRandomTime);
    sendMessageAboutCheckOutOutSession(user, randomTime);

    waitUntil(randomTime, () => attemptToAutoCheckOut(user));
  });
}

export function checkOutAtMaxWorkingTime() {
  const users = sesameDatabase.getAllUsers();
  if (!users.size) return;

  users.forEach(async (_, chatId) => {
    const user = await getRefreshedUserWorkingStatus(chatId);

    if (!user) return;
    if (user.workingStatus === "offline") return;

    checkOutAndMessage(user).then(() => logConsole(user, "Autoclose max time"));
  });
}
