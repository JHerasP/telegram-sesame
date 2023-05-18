import cron from "node-cron";
import { sesameDatabase } from "../Sesame-database/SesameDatabase";
import { sesameBot } from "../../../server";

export const startCron = () => {
  const onEveryDay = "*/5 * * * * *";
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
    { name: "Periodic run" }
  );
};

function isSameDay(until: Date, today: Date) {
  return until.getMonth() === today.getMonth() && until.getDate() === today.getDate();
}
