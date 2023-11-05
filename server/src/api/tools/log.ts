type UserLog = {
  chatId: number;
  employeeName: string;
};

const Logs = {
  logged: (user: UserLog, date: string) => `${date} ${user.chatId} ${user.employeeName} Logged`,

  closeSession: (user: UserLog, date: string) => `${date} ${user.chatId} ${user.employeeName} Clossed session`,

  remmemberToCheckIn: (user: UserLog, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process remmember to Check in`,

  checkIn: (user: UserLog, date: string) => `${date} ${user.chatId} ${user.employeeName} Check in`,

  checkOut: (user: UserLog, date: string) => `${date} ${user.chatId} ${user.employeeName} Check out`,

  startAutoCheckOut: (user: UserLog, date: string, time: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process start auto check out at ${time}`,

  AutoClose: (user: UserLog, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process auto check out completed`,

  abortAutoCheckOut: (user: UserLog, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Abort auto check out`,

  autoCheckOutMaxTime: (user: UserLog, date: string) =>
    `${date} ${user.chatId} ${user.employeeName} Process auto check out max time`,

  startTask: (user: UserLog, date: string, _: string, taskName: string) =>
    `${date} ${user.chatId} ${user.employeeName} Start task ${taskName}`,

  closeTask: (user: UserLog, date: string, _: string, taskName: string) =>
    `${date} ${user.chatId} ${user.employeeName} Close task ${taskName}`,

  requestedAccess: (user: UserLog, date: string, _: string, __: string) =>
    `${date} ${user.chatId} ${user.employeeName} Asked for access`,

  grantedAccess: (user: UserLog, date: string, _: string, __: string) =>
    `${date} ${user.chatId} ${user.employeeName} got access`,
};

type BaseLogs = keyof Omit<typeof Logs, "startAutoCheckOut" | "startTask" | "closeTask">;

function logConsole({ user, action }: { user: UserLog; action: BaseLogs }): void;
function logConsole({ user, action }: { user: UserLog; action: "startAutoCheckOut"; autoCloseTime: Date }): void;
function logConsole({ user, action }: { user: UserLog; action: "startTask" | "closeTask"; taskName: string }): void;
function logConsole({
  user,
  action,
  autoCloseTime = new Date(),
  taskName = "",
}: {
  user: UserLog;
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
