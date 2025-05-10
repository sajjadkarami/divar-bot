import { bot } from "../bot";
import { Messages } from "../constants";
import { prisma } from "../db";
import { Handler } from "./handler";

export enum Buttons {
  MY_AD = "🖇️ آگهی های من 🖇️",
  Subscription = "📜 اشتراک 📜",
  Channel = "کانال ℹ️",
  Support = "پشتیانی 🎗️",
  Education = "آموزش 📝",
  Back = "بازگشت به منوی اصلی ⬅️",
  SubmitAd = "ثبت آگهی",
  DeleteAd = "حذف آگهی",
}

export const startHandler: Handler = async (message) => {
  if (!message.from?.id) return;
  const user = await prisma.user.findFirst({ where: { id: message.from.id } });
  if (!user) {
    await prisma.user.create({
      data: {
        id: message.from.id,
        first_name: message.from.first_name,
        username: message.from.username,
      },
    });
  }
  await bot.sendMessage(message.chat.id, Messages.WELCOME, {
    reply_markup: {
      keyboard: [
        [{ text: Buttons.MY_AD }],
        [{ text: Buttons.Subscription }],
        [{ text: Buttons.Channel }, { text: Buttons.Education }],
        [{ text: Buttons.Support }],
      ],
    },
  });
};
