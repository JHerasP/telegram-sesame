import { ENV } from "../../../config";
import { sesameBotService } from "../../sesame-bot";
import { chatHistory } from "../../asesame-database/SesameChatHistory";
import { createJWT } from "../../tools/telegram-files/telegram-files";
import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const renewLoginScreen = (logUntil: string, jwt: string): TelegramScreen<never> => {
  const text = createText([
    { sentence: "Hey, your session will expire on" },
    { sentence: `${logUntil}`, style: { strong: true } },
    { sentence: "days." },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Fill the form again to renew it", style: { jumpLine: true } },
  ]);

  return {
    text,
    keyboard: [[{ text: "Log in", url: `http://${ENV.serverIp}:${ENV.port}/sesame/?jwt=${jwt}` }]],
    callbacks: [],
  };
};

export function sendRenewLogInMessage(chatId: number, expiration: Date) {
  if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(chatId);

  const today = new Date();
  const daysLeft = expiration.getDay() - today.getDay();

  const jwt = createJWT(chatId);
  const { text, keyboard } = renewLoginScreen(daysLeft.toString(), jwt);

  sesameBotService.sendMessage(chatId, text, keyboard);
}
