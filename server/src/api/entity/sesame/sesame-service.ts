import request from "request-promise-native";
import { awaitResolver } from "../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import decode from "jsonwebtoken/decode";
import { sendLoggedInMessage } from "../../Sesame-bot/sesame-actions";
import { HolidaysResponse, TaskTimer, TaskWeek, WorkType, YearHolidayResponse } from "./types";
import { logConsole } from "../../tools/log";

export async function logIn({ email, password }: { email: string; password: string }, jwt: string) {
  const clientServerOptions = {
    uri: ENV.sesameUrl,
    body: JSON.stringify({
      platformData: { platformName: "Chrome", platformSystem: "Linux", platformVersion: "112" },
      email: email,
      password: password,
    }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
    },
    resolveWithFullResponse: true,
  };

  const [response, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  if (errorResponse) throw new Error(errorResponse.error);
  else if (response.headers) {
    const cookies = response.headers["set-cookie"];
    const decoded = decode(jwt.split(" ")[1], { json: true });

    if (!decoded) return;

    const expiration = cookies[1].match(/expires=([^;]+)/)[1];
    const expirationDate = new Date(expiration);

    expirationDate.setDate(expirationDate.getDate() - 5);

    const [employeeInfo] = await awaitResolver(getEmployeeInfo(cookies[1]));

    if (employeeInfo) {
      const user: User = {
        telegramId: decoded.userId,
        sesameId: employeeInfo.id,
        employeeName: email,
        workingStatus: employeeInfo.workStatus,
        cookie: cookies[1],
        logSince: new Date(),
        logUntil: expirationDate,
        autoCheckOut: true,
        remmeberCheckIn: false,
        startTaskWhenCheckIn: false,
        rejectedAutoCheckOut: false,
      };
      sesameDatabase.setUser(decoded.userId, user);

      sendLoggedInMessage(decoded.userId);

      logConsole(user, "Logged");
    }
  }
}
// Not sending workCheckTypeId means check in from office.
// Nonsense, instead of using the list provided by the endpoint,
// it is a mix between the defaults and the ones created by the user.
export async function checkIn(user: User, workCheckTypeId?: string) {
  const { sesameId, cookie } = user;

  const clientServerOptions = {
    uri: ENV.checkIn.replace("idEmployee", sesameId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: workCheckTypeId }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  logConsole(user, "Check in");

  if (user.startTaskWhenCheckIn) {
    const [task] = await awaitResolver(getAllTask(user));
    if (!task) return;

    await reuseTask(user, task[0].days[0].timers[0]);
  }

  if (!errorResponse) return;

  if (errorResponse.statusCode === 422) {
    throw new Error("You are already in. How many times do you want to check in until you are satisfied? (╬▔皿▔)╯");
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}

export async function checkout(user: User) {
  const { sesameId, cookie } = user;
  const clientServerOptions = {
    uri: ENV.checkOut.replace("idEmployee", sesameId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  logConsole(user, "Check out");

  if (!errorResponse) return;
  if (errorResponse.statusCode === 422) {
    throw new Error("You are not working. How come can you stop working twice? (►__◄)");
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}

export async function getEmployeeInfo(cookie: string) {
  const clientServerOptions = {
    uri: ENV.employeeInfo,
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));
  if (body) {
    const data = JSON.parse(body);

    if (data) return data.data[0] as { id: string; workStatus: string };
  }

  return null;
}

export async function getYearHolidays({ cookie, sesameId }: User) {
  const year = new Date().getFullYear();
  const clientServerOptions = {
    uri: ENV.yearholidaysUrl.replace("idEmployee", sesameId).replace("year", year.toString()),
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body, error] = await awaitResolver(request(clientServerOptions));
  if (error) return;

  const data = JSON.parse(body);
  if (!data) return [];

  const holidays = data as YearHolidayResponse;

  return holidays.data.map((holiday) => holiday.date);
}

export async function getEmployeeHolidays({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.holidaysUrl.replace("idEmployee", sesameId),
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));
  if (!body) return [];

  const data = JSON.parse(body);

  if (!data) return [];

  const holidays = data as HolidaysResponse;

  return holidays.data.map((holiday) => {
    if (!holiday) return [];

    return holiday.daysOff.map((day) => day.date ?? "");
  });
}

export async function getWorkTypes({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.checkInTypes.replace("idEmployee", sesameId),
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));

  if (!body) return [];

  const data = JSON.parse(body);

  if (data) return data.data as WorkType[];
  return [];
}

export async function getAllTask({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.allTaskUrl.replace("idEmployee", sesameId),
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));

  if (!body) return [];

  const data = JSON.parse(body);

  if (data) return data.data as TaskWeek[];
  return [];
}

export async function reuseTask(user: User, task: TaskTimer) {
  const clientServerOptions = {
    uri: ENV.reuseTaskUrl.replace("taskId", task.id),
    method: "POST",
    body: JSON.stringify({ latitude: null, longitude: null }),
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: user.cookie,
    },
  };
  await awaitResolver<string, any>(request(clientServerOptions));
  logConsole(user, "Start task", undefined, task.comment);
}

export async function getActiveTask({ cookie, sesameId }: User) {
  const clientServerOptions = {
    uri: ENV.activeTaskUrl.replace("idEmployee", sesameId),
    method: "GET",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));

  if (!body) return undefined;

  const data = JSON.parse(body);

  if (data) return data.data as TaskTimer;
  return undefined;
}

export async function closeTask(user: User, taskId: string) {
  const clientServerOptions = {
    uri: ENV.closeTaskUrl.replace("idTask", taskId),
    method: "POST",
    body: JSON.stringify({ latitude: null, longitude: null }),
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: user.cookie,
    },
  };

  await awaitResolver(request(clientServerOptions));
  logConsole(user, "Start task", undefined, taskId); // TODO get task name
}
