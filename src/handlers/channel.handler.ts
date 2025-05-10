import TelegramBot from "node-telegram-bot-api";
import { Handler } from "./handler";
import { bot } from "../bot";
import { CHANNEL_URL, Messages } from "../constants";

export const channelHandler: Handler = (message) => {
  bot.sendMessage(message.chat.id, Messages.JOIN_CHANNEL_TEXT, {
    reply_markup: {
      inline_keyboard: [
        [{ text: Messages.JOIN_CHANNEL_BUTTON, url: CHANNEL_URL }],
      ],
    },
  });
};
