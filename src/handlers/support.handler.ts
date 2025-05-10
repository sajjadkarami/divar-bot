import { bot } from "../bot";
import { Messages, SUPPORT_URL } from "../constants";
import { Handler } from "./handler";

export const supportHandler: Handler = (message) => {
  bot.sendMessage(message.chat.id, Messages.SUPPORT_TEXT, {
    reply_markup: {
      inline_keyboard: [[{ text: Messages.SUPPORT_BUTTON, url: SUPPORT_URL }]],
    },
  });
};
