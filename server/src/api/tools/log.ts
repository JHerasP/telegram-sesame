import { User } from "../Sesame-database/SesameDatabase";

export function logConsole(
  user: User,
  action: "Logged" | "Check in" | "Check out" | "Start auto check out" | "AutoClose"
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
      console.info(`${date} ${telegramId} ${employeeName} is going to automatically check out`);
      break;
    case "AutoClose":
      console.info(`${date} ${telegramId} ${employeeName} was closed automatically`);
      break;
    default:
      console.info(`${date} ${telegramId} ${employeeName} unexpected action`);
      break;
  }
}
