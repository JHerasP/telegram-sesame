import { sesameBot } from "../sesame-bot/SesameBot";

export class SesameChatHistory {
  private history: Map<number, Set<number>>;

  constructor() {
    this.history = new Map<number, Set<number>>();
  }

  public get(chatId: number) {
    return this.history.get(chatId);
  }

  public createChatLog(chatId: number, messageId: number) {
    const chatLog = new Set<number>();
    chatLog.add(messageId);
    this.history.set(chatId, chatLog);
  }

  public updateChatLog(chatId: number, messageId: number) {
    const chatLog = this.history.get(chatId);

    if (chatLog) {
      chatLog.add(messageId);
      this.history.set(chatId, chatLog);
    }
  }

  public deleteChatHistory(chatId: number) {
    const chatLogs = this.history.get(chatId);
    if (chatLogs) {
      chatLogs.forEach((chatLog) => sesameBot.telegramBot.deleteMessage(chatId, chatLog).catch(() => undefined));
      chatLogs.clear();
    }
  }
}

export const chatHistory = new SesameChatHistory();
export const tempChatHistory = new SesameChatHistory();
