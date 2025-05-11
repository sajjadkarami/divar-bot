import { bot } from "../bot";
import { Messages } from "../constants";
import { prisma } from "../db";
import { Handler } from "./handler";

export const deleteHandler: Handler = async (message) => {
  const userId = message.chat.id;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { category: "" },
  });
  if (user) {
    await bot.sendMessage(userId, `‍لینک ${user.category} با موفقیت حذف شد.`);
  }
};
