import { User } from "../Sesame-database/SesameDatabase";

export function logConsole(
  user: User,
  action:
    | "Logged"
    | "Check in"
    | "Check out"
    | "Start auto check out"
    | "AutoClose"
    | "Abort autoclose"
    | "Autoclose max time",
  autocloseTime?: Date
) {
  const date = new Intl.DateTimeFormat("es-En", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(new Date());
  const { telegramId, employeeName } = user;

  switch (action) {
    case "Logged":
      console.info(`${date} ${telegramId} ${employeeName} just logged`);
      break;
    case "Check in":
      console.info(`${date} ${telegramId} ${employeeName} just checked in`);
      break;
    case "Check out":
      console.info(`${date} ${telegramId} ${employeeName} just checked out`);
      break;
    case "Start auto check out":
      const time = new Intl.DateTimeFormat("es-En", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(autocloseTime);

      console.info(`${date} ${telegramId} ${employeeName} is going to automatically check out at ${time}`);
      break;
    case "AutoClose":
      console.info(`${date} ${telegramId} ${employeeName} was closed automatically`);
      break;
    case "Abort autoclose":
      console.info(`${date} ${telegramId} ${employeeName} aborted auto check out`);
      break;
    case "Autoclose max time":
      console.info(`${date} ${telegramId} ${employeeName} auto checked out at max time`);
      break;
    default:
      console.info(`${date} ${telegramId} ${employeeName} unexpected action`);
      break;
  }
}