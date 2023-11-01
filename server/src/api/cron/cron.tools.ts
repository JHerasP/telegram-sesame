import cron from "node-cron";
import { User, sesameDatabase } from "../Sesame-database/SesameDatabase";
import logConsole from "../tools/log";

export function checkIfTodayIsHoliday(hollyDay: string[]) {
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

export function getRandomTimeInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shouldAbortAutoCheckOut(user: User) {
  const rejected = sesameDatabase.getUser(user.chatId)?.rejectedAutoCheckOut;

  if (rejected) {
    logConsole({ user, action: "abortAutoCheckOut" });
    sesameDatabase.toogleInminentAutoclose(user.chatId, false);
  }

  return Boolean(rejected);
}
