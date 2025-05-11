import TelegramBot from "node-telegram-bot-api";
import { bot } from "../bot";
import { prisma } from "../db";
import { Handler } from "./handler";
import { Buttons } from "./start.handler";

export const myAddsHandler: Handler = async (message) => {
  const user = await prisma.user.findFirst({ where: { id: message.chat.id } });
  let text = "";

  if (user && user?.category) {
    text = `آگهی فعلی شما، ${user.category} میباشد `;
  } else {
    text = "در اینجا میتوانید آگهی خود را مدیریت کنید.";
  }
  console.log(user?.category);
  console.log("user", user);
  console.log("text", text);

  const keyboard: TelegramBot.KeyboardButton[][] = [];
  keyboard.push([{ text: "بازگشت به منوی اصلی ⬅️" }]);
  let secondRowKeyboard = [];

  if (!user?.category) {
    secondRowKeyboard.push({ text: Buttons.SubmitAd });
  } else {
    secondRowKeyboard.push(
      { text: Buttons.EditAd },
      { text: Buttons.DeleteAd }
    );
  }

  keyboard.push(secondRowKeyboard);
  await bot.sendMessage(message.chat.id, text, {
    reply_markup: {
      keyboard,
    },
  });
};
