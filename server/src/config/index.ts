import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) throw new Error("⚠️  Couldn't find .env file  ⚠️");

const ENV = {
  port: process.env.SESAME_PROJECT_PORT!,
  telegramToken: process.env.SESAME_TELEGRAM_TOKEN!,
  sesameUrl: process.env.SESAME_URL!,
  sesameCrypto: process.env.SESAME_CRYPTO!,
  checkIn: process.env.SESAME_CHECK_IN_URL!,
  checkOut: process.env.SESAME_CHECK_OUT_URL!,
} as const;

export { ENV };
export * as configIndex from "./";
