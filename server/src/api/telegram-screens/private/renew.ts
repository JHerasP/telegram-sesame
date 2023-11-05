import { sesameBotService } from "../../sesame-bot";
import { chatHistory } from "../../Sesame-database/SesameChatHistory";
import getHtmlFile, { createJWT } from "../../tools/telegram-files/telegram-files";
import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const renewLoginScreen = (logUntil: string): TelegramScreen<never> => {
  const text = createText([
    { sentence: "Hey, your session will expire on" },
    { sentence: `${logUntil}`, style: { strong: true } },
    { sentence: "days." },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Fill the form again to renew it", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [[]],
    callbacks: [],
  };
};

export function sendRenewLogInMessage(chatId: number, expiration: Date) {
  if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(chatId);

  const today = new Date();
  const daysLeft = expiration.getDay() - today.getDay();

  const { text, keyboard } = renewLoginScreen(daysLeft.toString());
  // const jwt = createJWT(chatId);
  const file = getHtmlFile();

  const expiresOn = new Intl.DateTimeFormat("es").format(expiration);

  sesameBotService.sendMessage(chatId, text, keyboard);
  sesameBotService.sendFile(chatId, file, expiresOn.replace(/\//g, "-"));
}
