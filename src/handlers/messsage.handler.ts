import { intervals, setUserInterval, userState } from "..";
import { bot } from "../bot";
import { prisma } from "../db";
import { State } from "../dto/state.enum";
import { divarUrlSchema } from "../schema/divar.schema";
import { Handler } from "./handler";
import { parse } from "node-html-parser";

export const messageHandler: Handler = async (message) => {
  if (!message.text) return;
  if (!message.from?.id) return;

  const id = message.from.id;
  const state = userState[message.from.id];
  if (state === State.SEND_QUERY) {
    try {
      divarUrlSchema.parse(message.text);
      const response = await fetch(message.text);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      const root = parse(text);
      const category = root.querySelector(".seo-headline-ba08f")?.innerText;
      await prisma.user.update({
        where: { id },
        data: { query: message.text, category: category },
      });
      bot.sendMessage(id, `آگهی مورد نظر شما ، ${category} ثبت شد.`);
      const oldInterval = intervals.get(BigInt(id));
      if (oldInterval) clearInterval(oldInterval);
      setUserInterval(message?.from.id);
      userState[id] = State.SUBMITTED_QUERY;
    } catch (e) {
      console.log(e);
    }
  }
};
