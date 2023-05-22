import cron from "node-cron";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { sesameBot } from "../../../server";
import { checkout, getEmployeeInfo } from "../entity/sesame/sesame-service";
import { sendAutoCheckOut } from "../Sesame-bot/sesame-callback-actions";

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
      if (!users.size) return;
      users.forEach(async (info, userId) => {
        if (!info.autoClose) return;

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
