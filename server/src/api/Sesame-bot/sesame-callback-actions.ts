import { Message } from "node-telegram-bot-api";
import { User, sesameDatabase } from "../Sesame-database/SesameDatabase";
import { checkIn, checkout, getWorkTypes } from "../entity/sesame/sesame-service";
import {
  checkScreen,
  infoScreen,
  logOutScreen,
  firstStepsScreen as logginScreen,
  menuScreen,
  optionsScreen,
  welcomeScreen,
} from "../telegram-screens/screens";
import { telegramTools } from "../tools";
import getHtmlFile, { createJWT } from "../tools/telegram-files/telegram-files";
import { sesameBot } from "./SesameBot";
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
  else if (command === "MenuScreen: Check menu") sendCheckMenu({ messageId, userId });
  else if (command === "MenuScreen: Options") sendOptions(userId, user, messageId);
  else if (command === "MenuScreen: Refresh") sendMenu({ messageId, userId }).then(() => asnwerCallback(callbackId));
  else return;
}

export async function sendCheckMenu({ messageId, userId }: callbackIds) {
  if (!userId || !messageId) return;

  const user = sesameDatabase.getUser(userId);
  if (!user) return;
  const workTypes = await getWorkTypes(user);

  const { text, keyboard } = checkScreen(user, workTypes);

  telegramTools.editMessage(userId, text, keyboard, messageId);
}

export function handleCheckMenu(
  { callbackId, messageId, userId }: callbackIds,
  command: ReturnType<typeof checkScreen>["callbacks"][number]
) {
  if (!userId || !messageId || !callbackId) return;
  const user = sesameDatabase.getUser(userId);
  if (!user) return;

  if (command === "CheckScreen: Check in")
    return checkInSesame(user, callbackId).then(() => sendMenu({ messageId, userId }));
  else if (command === "CheckScreen: Check out")
    return checkOutSesame(user, callbackId).then(() => sendMenu({ messageId, userId }));
  else if (command === "CheckScreen: Back") return sendMenu({ messageId, userId });
  if (command.includes("CheckScreen"))
    return checkInSesame(user, callbackId, command).then(() => sendMenu({ messageId, userId }));
  else return;
}

export function sendLogInFile({ callbackId, userId }: callbackIds) {
  if (!userId || !callbackId) return;

  const jwt = createJWT(userId);
  const file = getHtmlFile(jwt);
  telegramTools.sendFile(userId, file, "ShadyLogIn");
  sesameBot.telegramBot.answerCallbackQuery(callbackId, {}).catch(() => undefined);
}

export function sendOptions(userId: number, user: User, messageId: number) {
  const { text, keyboard } = optionsScreen(user.autoCheckOut, user.remmeberCheckIn);

  telegramTools.editMessage(userId, text, keyboard, messageId);
}

export function toogleAutoclose({ messageId, userId }: callbackIds) {
  const user = sesameDatabase.getUser(userId);
  if (!userId || !user || !messageId) return;
  sesameDatabase.toogleAutoclose(userId);
  sendOptions(userId, user, messageId);
}

export function toogleRemmemberCheckIn({ messageId, userId }: callbackIds) {
  const user = sesameDatabase.getUser(userId);
  if (!userId || !user || !messageId) return;
  sesameDatabase.toogleremmeberCheckIn(userId);
  sendOptions(userId, user, messageId);
}

export function logOut({ messageId, userId }: callbackIds) {
  const { text } = logOutScreen();
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

function checkOutSesame(user: User, callbackId: string) {
  return checkout(user)
    .then(() => asnwerCallback(callbackId))
    .catch((err) => rejectCallback(callbackId.toString(), err.message));
}

function checkInSesame(user: User, callbackId: string, workCheckTypeId?: string) {
  const checkId = workCheckTypeId?.split(":")[1].split(" ").join("");

  return checkIn(user, checkId)
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
