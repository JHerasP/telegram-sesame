import cron from "node-cron";
import {
  sendAutoCheckOut,
  sendRemmberCheckIn as sendRememberCheckIn,
  sendRenewLogIn,
} from "../Sesame-bot/sesame-actions";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
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
          if (isSameDay(info.logUntil, today)) sendRenewLogIn(key, info.logUntil);
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
  const beforeClockingOut = "10 15 * * 1-5";

  cron.schedule(
    beforeClockingOut,
    () => {
      const users = sesameDatabase.getAllUsers();
      if (!users.size) return;

      users.forEach(async (info, userId) => {
        if (!info.autoCheckOut) return;

        await sesameDatabase.refresh(userId);

        const user = sesameDatabase.getUser(userId);

        if (user && user.workingStatus === "online")
          waitRandomTime(() =>
            checkout(user)
              .then(() => sendAutoCheckOut(userId))
              .catch(() => undefined)
          );
      });
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

export function startCronAutoCheckIn() {
  const beforeClockingOut = "7 10 * * 1-5";

  cron.schedule(
    beforeClockingOut,
    () => {
      const users = sesameDatabase.getAllUsers();
      if (!users.size) return;

      users.forEach(async (info, userId) => {
        if (!info.remmeberCheckIn) return;

        await sesameDatabase.refresh(userId);

        const user = sesameDatabase.getUser(userId);

        if (user && user.workingStatus === "offline") sendRememberCheckIn(userId);
      });
    },
    { name: "Autoclose", timezone: "Europe/Madrid" }
  );
}
