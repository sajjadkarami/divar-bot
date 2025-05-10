import * as dotenv from "dotenv";
import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "../generated/prisma";
import { bot, sendPhoto } from "./bot";
import { FETCH_INTERVAL } from "./constants";
import { fetchPost, findUser, upsertPost } from "./db";
import { State } from "./dto/state.enum";
import { Buttons, startHandler } from "./handlers/start.handler";
import { divarUrlSchema } from "./schema/divar.schema";
import { truncate } from "./utils";
import { channelHandler } from "./handlers/channel.handler";
import { supportHandler } from "./handlers/support.handler";
import { educationHandler } from "./handlers/educationHandler";
import { myAddsHandler } from "./handlers/myAdds.handler";
import { submitAdHandler } from "./handlers/submitAd.handler";
dotenv.config();

const prisma = new PrismaClient();

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
handlers.set(Buttons.Back, startHandler);
bot.on("message", async (message) => {
  if (!message.text) return;
  if (!message.from?.id) return;

  const handler = handlers.get(message.text);
  if (handler) {
    handler(message);
    return;
  }
  const id = message.from.id;
  const state = userState[message.from.id];
  if (state === State.SEND_QUERY) {
    try {
      divarUrlSchema.parse(message.text);
      userState[id] = State.SUBMITTED_QUERY;
      const response = await fetch(message.text);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const text = await response.text();
      const root = parse(text);
      const category = root.querySelector("seo-headline-ba08f")?.innerText;
      await prisma.user.update({
        where: { id },
        data: { query: message.text, category: category },
      });
      bot.sendMessage(id, `آگهی مورد نظر شما ، ${category} ثبت شد.`);
      const oldInterval = intervals.get(BigInt(id));
      if (oldInterval) clearInterval(oldInterval);
      setUserInterval(message?.from.id);
    } catch (e) {
      console.log(e);
    }
  }
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
    const items = JSON.parse(scripts[scripts.length - 1].innerHTML);
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

function buildCaption(post: any) {
  let caption = `<b>${post.title}</b>`;
  if (post.price) caption = caption + `<b>قیمت:</b> ${post.price} تومان\n`;
  if (post.productionDate)
    caption = caption + `<b>تاریخ تولید:</b> ${post.productionDate}\n`;
  if (post.color) caption = caption + `<b>رنگ:</b> ${post.color}\n`;
  if (post.model) caption = caption + `<b>مدل:</b> ${post.model}\n`;
  if (post.vehicleTransmission)
    caption = caption + `<b>نوع گیربکس:</b> ${post.vehicleTransmission}\n`;
  if (post.description)
    caption = caption + `<b>توضیحات:</b> ${post.description}\n`;
  if (post.name) caption += `<b>نام:</b> ${post.name}\n`;
  if (post.url) caption += `<a href="${post.url}">لینک</a>`;
  return caption;
}

function extractData(item: any) {
  return {
    id: item.url.split("/")[5],
    description: item.description,
    price: item.offers?.price,
    title: item.web_info?.title,
    productionDate: item?.production_date,
    color: item?.color,
    model: item?.model,
    image: item?.image,
    url: item?.url,
    name: item?.name,
    vehicleTransmission: item?.vehicle_transmission,
  };
}

function setUserInterval(userId: any) {
  const userInterval = setInterval(() => {
    fetchForUser(userId);
  }, FETCH_INTERVAL);
  intervals.set(userId, userInterval);
}

// (async () => {
//   const users = await prisma.user.findMany();
//   users.forEach((u) => {
//     setUserInterval(u.id);
//   });
// })();
