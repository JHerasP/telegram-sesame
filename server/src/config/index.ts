import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) throw new Error("⚠️  Couldn't find .env file  ⚠️");

const ENV = {
  port: process.env.SESAME_PROJECT_PORT,
} as const;

export { ENV };
export * as configIndex from "./";
