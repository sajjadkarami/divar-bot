import { parse } from "node-html-parser";
import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "../generated/prisma";
const category = "car";
const query = "207%20i";
const getContactUrl =
  "https://api.divar.ir/v8/postcontact/web/contact_info_v2/";
require("dotenv").config();
const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
  polling: true,
});
let cities;
async function getCities() {
  const response = await fetch(
    "https://api.divar.ir/v1/open-platform/assets/city"
  );
  cities = await response.json();
  console.log(cities);
}
enum State {
  SEND_QUERY,
  SUBMITTED_QUERY,
}
const userState = new Array<State>();
const handlers = new Map<string, (message: TelegramBot.Message) => void>();
handlers.set("/start", async (message: TelegramBot.Message) => {
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
  const state = userState[message.from.id];
  if (!state) {
    bot.sendMessage(message.chat.id, "کوئری را بفرستید.");
    userState[message.from.id] = State.SEND_QUERY;
  }
});

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
    prisma.user.update({
      where: { id },
      data: { query: message.text },
    });
    userState[id] = State.SUBMITTED_QUERY;
    bot.sendMessage(id, "کوئری ثبت شد.");
  }
});

async function fetchData() {
  try {
    const response = await fetch(
      `https://divar.ir/s/gorgan/${category}?q=${query}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const root = parse(text);
    const scripts = root.querySelectorAll("script");
    const items = JSON.parse(scripts[scripts.length - 1].innerHTML);
    const post = {
      id: items[0].url.split("/")[5],
      description: items[0].description,
      price: items[0].offers.price,
      city: items[0].web_info.city,
      title: items[0].web_info.title,
      productionDate: items[0].production_date,
      color: items[0].color,
      model: items[0].model,
      image: items[0].image,
      url: items[0].url,
      name: items[0].name,
      vehicleTransmission: items[0].vehicle_transmission,
    };
    console.log(post);

    bot.sendPhoto(process.env.TELEGRAM_CHAT_ID || "", post.image, {
      caption: `
<b>${post.title}</b>
<b>قیمت:</b> ${post.price} تومان
<b>شهر:</b> ${post.city}
<b>تاریخ تولید:</b> ${post.productionDate}
<b>رنگ:</b> ${post.color}
<b>مدل:</b> ${post.model}
<b>نوع گیربکس:</b> ${post.vehicleTransmission}
<b>توضیحات:</b> ${post.description}
<b>نام:</b> ${post.name}
<a href="${post.url}">لینک</a>
      `,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
async function main() {
  // await getCities();
}
main();
// fetchData();
// getContactInfo("AaacDD54");
