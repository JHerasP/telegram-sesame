import decode from "jsonwebtoken/decode";
import { User, sesameDatabase } from "../../../asesame-database/SesameDatabase";
import { awaitResolver } from "../../../../TS_tools/general-utility";
import { employeeApi } from "../employee/employee.index";
import { SesameEmployee } from "../employee/employee.types";
import { privateScreens } from "../../../telegram-screens";

function getExpirationDate(cookie: string) {
  const regrex = RegExp(/expires=([^;]+)/);

  const expiration = regrex.exec(cookie);
  if (expiration) {
    const expirationDate = new Date(expiration[1]);

    expirationDate.setDate(expirationDate.getDate() - 5);
    return expirationDate;
  }

  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 1);

  return currentDate;
}

export function createNewUser({
  userId,
  sesameEmployee,
  email,
  cookie,
}: {
  userId: number;
  sesameEmployee: SesameEmployee;
  email: string;
  cookie: string;
}) {
  const expiration = getExpirationDate(cookie);

  const user: User = {
    chatId: userId,
    sesameId: sesameEmployee.id,
    employeeName: email,
    workingStatus: sesameEmployee.workStatus,
    cookie,
    logSince: new Date(),
    logUntil: expiration,
    autoCheckOut: true,
    remmeberCheckIn: false,
    startTaskWhenCheckIn: false,
    rejectedAutoCheckOut: false,
  };

  sesameDatabase.setUser(userId, user);
}

export async function processLoggedInUser(
  headers: Record<string, string>,
  jwt: string,
  email: string
) {
  const cookies = headers["set-cookie"];
  const decoded: { userId: number } = decode(jwt.split(" ")[1], { json: true });

  if (!decoded) return;

  const [sesameEmployee] = await awaitResolver(employeeApi.getEmployeeInfo(cookies[1]));

  if (!sesameEmployee) return;

  createNewUser({ userId: decoded.userId, sesameEmployee, email, cookie: cookies[1] });

  privateScreens.sendLoggedWelcomeMessage(decoded.userId);
}
