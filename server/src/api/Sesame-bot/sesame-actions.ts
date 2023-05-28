import { chatHistory } from "../Sesame-database/SesameChatHistory";
import { autoCheckOutScreen, loggedScreen, remmemberChecInScreen, renewLoginScreen } from "../telegram-screens/screens";
import { telegramTools } from "../tools";
import getHtmlFile, { createJWT } from "../tools/telegram-files/telegram-files";

export async function sendAutoCheckOut(userId: number) {
  if (!userId) return;
  const { text, keyboard } = autoCheckOutScreen();

  telegramTools.sendMessage(userId, text, keyboard);
}

export async function sendRemmberCheckIn(userId: number) {
  if (!userId) return;

  const { text, keyboard } = remmemberChecInScreen();

  telegramTools.sendMessage(userId, text, keyboard);
}

export function sendLoggedInMessage(chatId: number) {
  if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(chatId);

  if (!chatId) return;
  const { text, keyboard } = loggedScreen();

  telegramTools.sendMessage(chatId, text, keyboard);
}

export function sendRenewLogIn(chatId: number, expiration: Date) {
  if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(chatId);

  if (!chatId) return;
  const today = new Date();
  const daysLeft = expiration.getDay() - today.getDay();

  const { text, keyboard } = renewLoginScreen(daysLeft.toString());
  const jwt = createJWT(chatId);
  const file = getHtmlFile(jwt);

  const expiresOn = new Intl.DateTimeFormat("es").format(expiration);

  telegramTools.sendMessage(chatId, text, keyboard);
  telegramTools.sendFile(chatId, file, expiresOn.replace(/\//g, "-"));
}
