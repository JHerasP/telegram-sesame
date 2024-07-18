import { sesameBotService } from "../../sesame-bot";
import { chatHistory } from "../../asesame-database/SesameChatHistory";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

export type LoggedCallbacks = "LoggingWelcomeScreen: start";

const loggingWelcome = (): TelegramScreen<LoggedCallbacks> => {
  const text = createText([
    { sentence: "Everything went fine...", style: { jumpLine: true } },
    { sentence: "Yes I know, I am also surprised. ( ͡ಠ ʖ̯ ͡ಠ)", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "If you find any problem, I recommend you to write:" },
    { sentence: " /start ", style: { italic: true } },
    { sentence: "and log in again" },
  ]);

  return {
    text,
    keyboard: [
      [
        createButton<LoggedCallbacks>(
          "I want to eat pancakes (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
          "LoggingWelcomeScreen: start"
        ),
      ],
    ],
    callbacks: ["LoggingWelcomeScreen: start"],
  };
};

export function sendLoggedWelcomeMessage(chatId: number) {
  if (chatHistory.get(chatId)?.size) chatHistory.deleteChatHistory(chatId);

  const { text, keyboard } = loggingWelcome();

  sesameBotService.sendMessage(chatId, text, keyboard);
}
