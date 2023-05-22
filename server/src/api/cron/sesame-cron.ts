import cron from "node-cron";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { sesameBot } from "../../../server";
import { checkout } from "../entity/sesame/sesame-service";

export function startCronSessionCheck() {
  const onEveryDay = "0 12 * * *";
  cron.schedule(
    onEveryDay,
    () => {
      const today = new Date();
      const users = sesameDatabase.getAllUsers();
      if (users.size) {
        users.forEach((info, key) => {
          if (isSameDay(info.logUntil, today)) sesameBot.sendRenewLogIn(key, info.logUntil);
        });
      }
    },
    { name: "Periodic run", timezone: "Europe/Madrid" }
  );
}

function isSameDay(until: Date, today: Date) {
  return until.getMonth() === today.getMonth() && until.getDate() === today.getDate();
}

export function startCronAutoClockOut() {
  const beforeClockingOut = "15 20 * * 1-5";
  cron.schedule(
    beforeClockingOut,
    () => {
      const users = sesameDatabase.getAllUsers();
      if (users.size) users.forEach((info) => info.autoClose && waitRandomTime(() => checkout(info)));
    },
    { name: "Autoclose", timezone: "Europe/Madrid" }
  );
}

function waitRandomTime(callback: VoidFunction) {
  const minTime = 1 * 60 * 1000;
  const maxTime = 7 * 60 * 1000;

  const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

  setTimeout(callback, randomTime);
}
