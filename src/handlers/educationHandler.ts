import { error } from "console";
import { bot } from "../bot";
import { Handler } from "./handler";

export const educationHandler: Handler = async (message) => {
  try {
    await bot.forwardMessage(
      message.chat.id,
      process.env.TELEGRAM_CHANNEL_ID || "",
      Number(process.env.TELEGRAM_CHANNEL_POST_ID)
    );
  } catch (e) {
    console.log("error", e);
  }
};
