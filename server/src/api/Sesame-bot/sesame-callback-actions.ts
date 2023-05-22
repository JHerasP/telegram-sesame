import JWT from "jsonwebtoken";
import { CallbackQuery, Message } from "node-telegram-bot-api";
import { sesameBot } from "../../../server";
import { ENV } from "../../config";
import { User, sesameDatabase } from "../Sesame-database/SesameDatabase";
import { checkIn, checkout } from "../entity/sesame/sesame-service";
import {
  infoScreen,
  autoCheckOutScreen,
  loggedScreen,
  firstStepsScreen as logginScreen,
  menuScreen,
  optionsScreen,
  renewLoginScreen,
  welcomeScreen,
} from "../telegram-screens/screens";
import { telegramTools } from "../tools";
import getHtmlFile from "../tools/telegram-files/telegram-files";
import { callbackIds } from "./sesame-command-helper";

export function sendWelcomeMessage(msg: Message): void {
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!userId) return;
  const { text, keyboard } = welcomeScreen();

  telegramTools.sendMessage(chatId, text, keyboard);
}

export function sendLoggin({ messageId, userId }: callbackIds) {
  if (!userId || !messageId) return;
  const { text, keyboard } = logginScreen();

  const jwt = createJWT(userId);
  const file = getHtmlFile(jwt);
  telegramTools.editMessage(userId, text, keyboard, messageId);
  telegramTools.sendFile(userId, file, "ShadyLogIn");
}

function createJWT(userId: number) {
  const token = JWT.sign(JSON.stringify({ userId }), ENV.sesameCrypto);

  return token;
}

export function sendLoggedIn(userId: number) {
  if (!userId) return;
  const { text, keyboard } = loggedScreen();

  telegramTools.sendMessage(userId, text, keyboard);
}

export async function sendMenu({ messageId, userId }: callbackIds) {
  if (!userId || !messageId) return;

  await sesameDatabase.refresh(userId);
  const user = sesameDatabase.getUser(userId);
  if (!user) return;

  const { text, keyboard } = menuScreen(user);

  telegramTools.editMessage(userId, text, keyboard, messageId);
}

export function handleMenu(
  { callbackId, messageId, userId }: callbackIds,
  command: ReturnType<typeof menuScreen>["callbacks"][number]
) {
  if (!userId || !messageId || !callbackId) return;
  const user = sesameDatabase.getUser(userId);
  if (!user) return;

  if (command === "MenuScreen: Info") sendInfo(user, userId, messageId);
  else if (command === "MenuScreen: Check in")
    checkInSesame(user, callbackId).then(() => sendMenu({ messageId, userId }));
  else if (command === "MenuScreen: Check out")
    checkOutSesame(user, callbackId).then(() => sendMenu({ messageId, userId }));
  else if (command === "MenuScreen: Options") sendOptions(userId, user, messageId);
  else if (command === "MenuScreen: Refresh") sendMenu({ messageId, userId });
  else return;
}

export function sendLogInFile({ callbackId, userId }: callbackIds) {
  if (!userId || !callbackId) return;

  const jwt = createJWT(userId);
  const file = getHtmlFile(jwt);
  telegramTools.sendFile(userId, file, "ShadyLogIn");
  sesameBot.telegramBot.answerCallbackQuery(callbackId, {});
}

export function sendRenewLoggin(userId: number, expiration: Date) {
  if (!userId) return;
  const today = new Date();
  const daysLeft = expiration.getDay() - today.getDay();

  const { text, keyboard } = renewLoginScreen(daysLeft.toString());
  const jwt = createJWT(userId);
  const file = getHtmlFile(jwt);

  const expiresOn = new Intl.DateTimeFormat("es").format(expiration);

  telegramTools.sendMessage(userId, text, keyboard);
  telegramTools.sendFile(userId, file, expiresOn.replace(/\//g, "-"));
}

export function sendOptions(userId: number, user: User, messageId: number) {
  const { text, keyboard } = optionsScreen(user.autoClose);

  telegramTools.editMessage(userId, text, keyboard, messageId);
}

export function toogleAutoclose({ messageId, userId }: callbackIds) {
  const user = sesameDatabase.getUser(userId);
  if (!userId || !user || !messageId) return;
  sesameDatabase.toogleAutoclose(userId);
  sendOptions(userId, user, messageId);
}

export function logOut({ messageId, userId }: callbackIds) {
  const { text } = autoCheckOutScreen();
  if (!userId || !messageId) return;

  sesameDatabase.logOut(userId);
  telegramTools.editMessage(userId, text, [], messageId);
}

function sendInfo(user: User, userId: number, messageId: number) {
  const since = new Intl.DateTimeFormat("es").format(user.logSince);
  const until = new Intl.DateTimeFormat("es").format(user.logUntil);

  const { text, keyboard } = infoScreen(since, until);

  telegramTools.editMessage(userId, text, keyboard, messageId);
}

export async function sendAutoCheckOut(userId: number) {
  if (!userId) return;

  const { text, keyboard } = autoCheckOutScreen();

  telegramTools.sendMessage(userId, text, keyboard);
}

function checkOutSesame(user: User, callbackId: string) {
  return checkout(user)
    .then(() => asnwerCallback(callbackId))
    .catch((err) => rejectCallback(callbackId.toString(), err.message));
}

function checkInSesame(user: User, callbackId: string) {
  return checkIn(user)
    .then(() => asnwerCallback(callbackId))
    .catch((err) => rejectCallback(callbackId, err.message));
}

function asnwerCallback(callbackId: string) {
  sesameBot.telegramBot
    .answerCallbackQuery(callbackId, { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" })
    .catch(() => undefined);
}

function rejectCallback(callbackId: string, message?: string) {
  sesameBot.telegramBot
    .answerCallbackQuery(callbackId, { text: message ?? "Welp, something went wrong (●'◡'●)", show_alert: true })
    .catch(() => undefined);
}
