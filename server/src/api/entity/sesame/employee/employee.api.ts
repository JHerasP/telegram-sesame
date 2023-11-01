import { awaitResolver } from "../../../../TS_tools/general-utility";
import { ENV } from "../../../../config";
import request from "request-promise-native";
import { User } from "../../../Sesame-database/SesameDatabase";
import { getDaysOff } from "./employee.tools";
import { HolidaysResponse, SesameEmployee, WorkType, YearHolidayResponse } from "./employee.types";

const baseheaders = {
  "User-Agent": "Request-Promise",
  "Content-Type": "application/json",
};

export async function getEmployeeInfo(cookie: string) {
  const clientServerOptions = {
    uri: ENV.employeeInfo,
    method: "GET",
    headers: { ...baseheaders, Cookie: cookie },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));
  if (!body) return null;

  const data = JSON.parse(body);

  if (data) return data.data[0] as SesameEmployee;

  return null;
}

export async function getYearHolidays({ cookie, sesameId }: User) {
  const year = new Date().getFullYear();
  const clientServerOptions = {
    uri: ENV.yearholidaysUrl.replace("idEmployee", sesameId).replace("year", year.toString()),
    method: "GET",
    headers: { ...baseheaders, Cookie: cookie },
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
    headers: { ...baseheaders, Cookie: cookie },
  };

  const [body] = await awaitResolver<string, any>(request(clientServerOptions));
  if (!body) return [];

  const data = JSON.parse(body);
  if (!data) return [];

  return getDaysOff(data as HolidaysResponse);
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
