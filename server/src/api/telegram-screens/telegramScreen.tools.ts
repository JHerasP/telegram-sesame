import { sesameBot } from "../sesame-bot/SesameBot";

export function asnwerCallback(callbackId: string) {
  sesameBot.telegramBot
    .answerCallbackQuery(callbackId, { text: "Operation done (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" })
    .catch(() => undefined);
}

export function rejectCallback(callbackId: string, message?: string) {
  sesameBot.telegramBot
    .answerCallbackQuery(callbackId, { text: message ?? "Welp, something went wrong (●'◡'●)", show_alert: true })
    .catch(() => undefined);
}
