import cron from "node-cron";
import { awaitResolver } from "../../TS_tools/general-utility";
import {
  sendAutoCheckOut,
  sendPreviousAutoCheckOut,
  sendRemmberCheckIn as sendRememberCheckIn,
  sendRenewLogIn,
} from "../Sesame-bot/sesame-actions";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { checkout, getEmployeeHolidays, getYearHolidays } from "../entity/sesame/sesame-service";
import { checkHoliday } from "./cron-tools";
import { logConsole } from "../tools/log";
const minTime = 1 * 60 * 1000;
const maxTime = 7 * 60 * 1000;

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

        if (user && user.workingStatus !== "offline") {
          const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
          const currentTime = new Date();

          const futureTime = new Date(currentTime.getTime() + randomTime);

          sendPreviousAutoCheckOut(userId, futureTime);
          logConsole(user, "Start auto check out", futureTime);

          waitRandomTime(() => {
            const rejected = sesameDatabase.getUser(userId)?.rejectedAutoCheckOut;
            if (rejected) {
              logConsole(user, "Abort autoclose");
              return sesameDatabase.toogleInminentAotoclose(userId, false);
            }

            checkout(user)
              .then(() => {
                sendAutoCheckOut(userId);

                logConsole(user, "AutoClose");
              })
              .catch(() => undefined);
          }, randomTime);
        }
      });
    },
    { name: "Autoclose", timezone: "Europe/Madrid" }
  );
}

function waitRandomTime(callback: VoidFunction, randomTime: number) {
  setTimeout(callback, randomTime);
}

export function startCronAutoCheckIn() {
  const beforeClockingIn = "10 7 * * 1-5";

  cron.schedule(
    beforeClockingIn,
    () => {
      const users = sesameDatabase.getAllUsers();
      if (!users.size) return;

      users.forEach(async (_, userId) => {
        await sesameDatabase.refresh(userId);
        const user = sesameDatabase.getUser(userId);

        if (!user) return;
        if (!user.remmeberCheckIn) return;
        if (user.workingStatus !== "offline") return;

        const [holidays] = await awaitResolver(getEmployeeHolidays(user));
        const [yearHolidays] = await awaitResolver(getYearHolidays(user));

        if (holidays && yearHolidays) {
          const isHolyday = checkHoliday(holidays.flat());
          const isYearHolyday = checkHoliday(yearHolidays);

          if (!isHolyday && !isYearHolyday) sendRememberCheckIn(userId);
        }
      });
    },
    { name: "AutoCheckIn", timezone: "Europe/Madrid" }
  );
}

export function startCronAutoCheckOutMaxTime() {
  const maxTime = "29 15 * * 1-5";

  cron.schedule(
    maxTime,
    () => {
      const users = sesameDatabase.getAllUsers();
      if (!users.size) return;

      users.forEach(async (_, userId) => {
        await sesameDatabase.refresh(userId);
        const user = sesameDatabase.getUser(userId);

        if (!user) return;
        if (user.workingStatus === "offline") return;

        checkout(user)
          .then(() => {
            sendAutoCheckOut(userId);

            logConsole(user, "AutoClose");
          })
          .catch(() => undefined);
      });
    },
    { name: "AutoCheckOutMaxTime", timezone: "Europe/Madrid" }
  );
}
