import dotenv from "dotenv";
import { validateENV } from "./confix-helper";

const envFound = dotenv.config();
if (envFound.error) throw new Error("⚠️  Couldn't find .env file  ⚠️");

const ENV = {
  dev: process.env.SESAME_DEV!,
  port: process.env.SESAME_PROJECT_PORT!,
  host: process.env.SESAME_PROJECT_HOST!,
  telegramToken:
    process.env.SESAME_DEV === "true" ? process.env.SESAME_TELEGRAM_TOKEN_DEV! : process.env.SESAME_TELEGRAM_TOKEN!,
  sesameUrl: process.env.SESAME_URL!,
  sesameCrypto: process.env.SESAME_CRYPTO!,
  checkIn: process.env.SESAME_CHECK_IN_URL!,
  checkOut: process.env.SESAME_CHECK_OUT_URL!,
  employeeInfo: process.env.SESAME_EMPLOYEE_INFO!,
  holidaysUrl: process.env.SESAME_EMPLOYEE_HOLIDAYS!,
  yearholidaysUrl: process.env.SESAME_YEAR_HOLIDAYS!,
  checkInTypes: process.env.SESAME_CHECK_IN_TYPES!,
  serverIp: process.env.SESAME_DEV === "true" ? "localhost" : process.env.SESAME_SERVER_IP!,
  allTaskUrl: process.env.SESAME_GET_ALL_TASK!,
  reuseTaskUrl: process.env.SESAME_REUSE_TASK!,
  activeTaskUrl: process.env.SESAME_ACTIVE_TASK!,
  closeTaskUrl: process.env.SESAME_CLOSE_TASK!,
} as const;

validateENV(ENV);

export { ENV };
export * as configIndex from "./";
