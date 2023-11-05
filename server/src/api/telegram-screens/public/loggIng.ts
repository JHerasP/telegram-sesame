import { ENV } from "../../../config";
import { sesameBotService } from "../../sesame-bot";
import { TelegramCommand } from "../../sesame-bot/command/command.types";
import { createJWT } from "../../tools/telegram-files/telegram-files";
import { createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

const loggingScreen = (jwt: string): TelegramScreen<never> => {
  const text = createText([
    { sentence: "First, I need you to " },
    { sentence: "log in.", style: { strong: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Don't worry, I am not going to steal your information (⌐■_■)", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "After you finish it, You will receive a message on", style: {} },
    { sentence: " this ", style: { bold: true } },
    { sentence: "chat." },
  ]);
  return {
    text,
    keyboard: [[{ text: "Log in", url: `http://${ENV.serverIp}:${ENV.port}/sesame/?jwt=${jwt}` }]],
    callbacks: [],
  };
};

export function sendLoggingMessage({ messageId, chatId }: TelegramCommand) {
  const jwt = createJWT(chatId);
  const { text, keyboard } = loggingScreen(jwt);

  sesameBotService.editMessage(chatId, text, keyboard, messageId);
}
