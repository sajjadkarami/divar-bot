import * as dotenv from "dotenv";

import TelegramBot from "node-telegram-bot-api";
import { bot, sendPhoto } from "./bot";
import { FETCH_INTERVAL } from "./constants";
import { fetchPost, findUser, prisma, upsertPost } from "./db";
import { State } from "./dto/state.enum";
import { channelHandler } from "./handlers/channel.handler";
import { deleteHandler } from "./handlers/deleteHandler";
import { educationHandler } from "./handlers/educationHandler";
import { messageHandler } from "./handlers/messsage.handler";
import { myAddsHandler } from "./handlers/myAdds.handler";
import { Buttons, startHandler } from "./handlers/start.handler";
import { submitAdHandler } from "./handlers/submitAd.handler";
import { supportHandler } from "./handlers/support.handler";
import { buildCaption, extractData, truncate } from "./utils";
import { parse } from "node-html-parser";

dotenv.config();

export const userState = new Array<State>();
export const handlers = new Map<
  string,
  (message: TelegramBot.Message) => void
>();

export const intervals = new Map<bigint, NodeJS.Timeout>();

handlers.set("/start", startHandler);
handlers.set(Buttons.MY_AD, myAddsHandler);
// handlers.set(Buttons.Subscription, subscriptionHandler);
handlers.set(Buttons.Channel, channelHandler);
handlers.set(Buttons.Education, educationHandler);
handlers.set(Buttons.Support, supportHandler);
handlers.set(Buttons.SubmitAd, submitAdHandler);
handlers.set(Buttons.EditAd, submitAdHandler);
handlers.set(Buttons.Back, startHandler);
handlers.set(Buttons.DeleteAd, deleteHandler);

bot.on("message", async (message) => {
  if (!message.text) return;
  if (!message.from?.id) return;

  const handler = handlers.get(message.text);
  if (handler) {
    handler(message);
    return;
  }
  messageHandler(message);
});

async function fetchForUser(userId: any) {
  try {
    const user = await findUser(userId);
    if (!user?.query) return;
    const response = await fetch(user.query);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const root = parse(text);
    const scripts = root.querySelectorAll("script");
    const items: Array<any> = JSON.parse(scripts[scripts.length - 1].innerHTML);
    const reversedItems = items.reverse();
    reversedItems.map(async (item: any) => {
      const post = extractData(item);
      const databasePost = await fetchPost(userId, post.id);
      console.log(items);
      if (databasePost) return;
      const caption = buildCaption(post);
      await sendPhoto(userId, post.image, truncate(caption));
      await upsertPost(userId, post.id);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

export function setUserInterval(userId: any) {
  const userInterval = setInterval(() => {
    fetchForUser(userId);
  }, FETCH_INTERVAL);
  intervals.set(userId, userInterval);
}

(async () => {
  const users = await prisma.user.findMany();
  users.forEach((u) => {
    setUserInterval(u.id);
  });
})();
