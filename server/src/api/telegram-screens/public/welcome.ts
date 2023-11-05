import { sesameBotService } from "../../sesame-bot";
import { createButton, createText } from "../keyboards/keyboard";
import { TelegramScreen } from "../telegramScreens.types";

export type welcomeCallbacks = "wellcomeScreen: Conditions";
const welcomeScreen = (): TelegramScreen<welcomeCallbacks> => {
  const text = createText([
    { sentence: "ヾ(•ω•`)o", style: { strong: true } },
    { sentence: " Wellcome to the sesame bot 1993", style: { strong: true, underline: true, jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "Before we start, I need you to accept the next " },
    { sentence: "conditions:", style: { jumpLine: true, strong: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "- I won't blame the creator for any bug or mistake that this " },
    { sentence: "rushed", style: { strong: true, jumpLine: true } },
    { sentence: "bot makes.", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "- I won't talk about this bot to anybody.", style: { jumpLine: true } },
    { sentence: "", style: { jumpLine: true } },
    { sentence: "- If you are happy with the bot, you have to " },
    { sentence: "pat ", style: { strong: true } },
    { sentence: "the creator on the head and say: " },
    { sentence: "good boy", style: { italic: true } },
  ]);

  return {
    text,
    keyboard: [[createButton<welcomeCallbacks>("We only live once, lets go!", "wellcomeScreen: Conditions")]],
    callbacks: ["wellcomeScreen: Conditions"],
  };
};

export function sendWelcomeMessage(chatId: number): void {
  const { text, keyboard } = welcomeScreen();

  sesameBotService.sendMessage(chatId, text, keyboard);
}
