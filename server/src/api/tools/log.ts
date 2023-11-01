import { User } from "../Sesame-database/SesameDatabase";

const Logs = {
  logged: (user: User, date: string) => `${date} ${user.chatId} ${user.employeeName} Logged`,

  closeSession: (user: User, date: string) => `${date} ${user.chatId} ${user.employeeName} Clossed session`,

  remmemberToCheckIn: (user: User, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process remmember to Check in`,

  checkIn: (user: User, date: string) => `${date} ${user.chatId} ${user.employeeName} Check in`,

  checkOut: (user: User, date: string) => `${date} ${user.chatId} ${user.employeeName} Check out`,

  startAutoCheckOut: (user: User, date: string, time: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process start auto check out at ${time}`,

  AutoClose: (user: User, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process auto check out completed`,

  abortAutoCheckOut: (user: User, date: string) => `${date} ${user.chatId} ${user.employeeName} Abort auto check out`,

  autoCheckOutMaxTime: (user: User, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process auto check out max time`,

  startTask: (user: User, date: string, _: string, taskName: string) =>
    `${date} ${user.chatId} ${user.employeeName} Start task ${taskName}`,

  closeTask: (user: User, date: string, _: string, taskName: string) =>
    `${date} ${user.chatId} ${user.employeeName} Close task ${taskName}`,
};

type BaseLogs = keyof Omit<typeof Logs, "startAutoCheckOut" | "startTask" | "closeTask">;

function logConsole({ user, action }: { user: User; action: BaseLogs }): void;
function logConsole({ user, action }: { user: User; action: "startAutoCheckOut"; autoCloseTime: Date }): void;
function logConsole({ user, action }: { user: User; action: "startTask" | "closeTask"; taskName: string }): void;
function logConsole({
  user,
  action,
  autoCloseTime = new Date(),
  taskName = "",
}: {
  user: User;
  action: keyof typeof Logs;
  autoCloseTime?: Date;
  taskName?: string;
}): void {
  const date = getFulldate();
  const autoClose = getTime(autoCloseTime);

  console.info(
    Logs[action](user, date, autoClose, taskName) || `${date} ${user.chatId} ${user.employeeName} unexpected action`
  );
}

export default logConsole;

function getFulldate() {
  const date = new Intl.DateTimeFormat("es-En", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(new Date());
  return date;
}

function getTime(autocloseTime: Date) {
  const date = new Intl.DateTimeFormat("es-En", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(autocloseTime);
  return date;
}
