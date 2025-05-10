import TelegramBot from "node-telegram-bot-api";
import { EMPTY_IMAGE } from "./constants";

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
  polling: true,
});

export async function sendMessage(id: bigint, message: string) {
  await bot.sendMessage(id.toString(), message);
}

export async function sendPhoto(
  userId: bigint,
  image: string,
  caption: string
) {
  await bot.sendPhoto(userId.toString(), image ? image : EMPTY_IMAGE, {
    caption,
    parse_mode: "HTML",
  });
}
