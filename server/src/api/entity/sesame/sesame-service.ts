import request from "request-promise-native";
import { awaitResolver } from "../../../TS_tools/general-utility";
import { ENV } from "../../../config";
import { User, sesameDatabase } from "../../Sesame-database/SesameDatabase";
import decode from "jsonwebtoken/decode";

import { sendLoggedInMessage } from "../../Sesame-bot/sesame-actions";
import { HolidaysResponse, YearHolidayResponse } from "./types";

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
  else {
    if (response.headers) {
      const cookies = response.headers["set-cookie"];
      const decoded = decode(jwt.split(" ")[1], { json: true });

      if (!decoded) return;

      const expiration = cookies[1].match(/expires=([^;]+)/)[1];
      const expirationDate = new Date(expiration);

      expirationDate.setDate(expirationDate.getDate() - 5);

      const [employeeInfo] = await awaitResolver(getEmployeeInfo(cookies[1]));

      if (employeeInfo) {
        sesameDatabase.setUser(decoded.userId, {
          employeeId: employeeInfo.id,
          workingStatus: employeeInfo.workStatus,
          cookie: cookies[1],
          logSince: new Date(),
          logUntil: expirationDate,
          autoCheckOut: true,
          remmeberCheckIn: true,
          autoCheckIn: false,
        });
        sendLoggedInMessage(decoded.userId);
      }
    }
  }
}

export async function checkIn(user: User) {
  const { employeeId, cookie } = user;

  const clientServerOptions = {
    uri: ENV.checkIn.replace("idEmployee", employeeId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));

  if (!errorResponse) return;

  if (errorResponse.statusCode === 422) {
    throw new Error("You are already in. How many times do you want to check in until you are satisfied? (╬▔皿▔)╯");
  } else {
    throw new Error("Meh, my creator screwed up somehow, try to log in again (┬┬﹏┬┬)");
  }
}

export async function checkout(user: User) {
  const { employeeId, cookie } = user;
  const clientServerOptions = {
    uri: ENV.checkOut.replace("idEmployee", employeeId),
    body: JSON.stringify({ origin: "web", coordinates: {}, workCheckTypeId: null }),
    method: "POST",
    headers: {
      "User-Agent": "Request-Promise",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  };

  const [_, errorResponse] = await awaitResolver<any, any>(request(clientServerOptions));
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
    if (data) return data.data[0] as { id: string; workStatus: "online" | "offline" };
  }

  return null;
}

export async function getYearHolidays({ cookie, employeeId }: User) {
  const year = new Date().getFullYear();
  const clientServerOptions = {
    uri: ENV.yearholidaysUrl.replace("idEmployee", employeeId).replace("year", year.toString()),
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
    if (data) {
      const holidays = data as YearHolidayResponse;

      return holidays.data.map((holiday) => holiday.date);
    }
  }
  return [];
}

export async function getEmployeeHolidays({ cookie, employeeId }: User) {
  const clientServerOptions = {
    uri: ENV.holidaysUrl.replace("idEmployee", employeeId),
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
    if (data) {
      const holidays = data as HolidaysResponse;

      return holidays.data.map((holiday) => {
        if (holiday)
          return holiday.daysOff.map((day) => {
            if (day.date) return day.date;
            else return "";
          });
        else return [];
      });
    }
  }
  return [];
}
