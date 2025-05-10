import TelegramBot from "node-telegram-bot-api";

export type Handler = (message: TelegramBot.Message) => void;
