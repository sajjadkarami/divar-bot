import TelegramBot from "node-telegram-bot-api";
import { PrismaClient } from "../generated/prisma";
import { WidgetList } from "./widgetList.dto";
import { SearchRequest } from "./Request.dto";

require("dotenv").config();
const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
  polling: true,
});

async function fetchData(cityId: string) {
  const req: SearchRequest = {
    city_ids: [cityId],
    pagination_data: {
      "@type": "type.googleapis.com/post_list.PaginationData",
      last_post_date: "2025-05-01T14:51:43.244792Z",
      page: -1,
      layer_page: -1,
      search_uid: "b6482299-8406-4758-8eb6-b5f8a71e381b",
    },
    disable_recommendation: false,
    map_state: {
      camera_info: {
        bbox: {},
      },
    },
    search_data: {
      form_data: {
        data: {
          sort: {
            str: {
              value: "sort_date",
            },
          },
          category: {
            str: {
              value: "light",
            },
          },
        },
      },
      server_payload: {
        "@type": "type.googleapis.com/widgets.SearchData.ServerPayload",
        additional_form_data: {},
      },
      query: "207 i",
    },
  };

  const request = await fetch(process.env.DIVAR_API_URL || "", {
    method: "POST",
    headers: { Authorization: `Basic ${process.env.DIVAR_API_KEY}` },
    body: JSON.stringify(req),
  });
  if (!request.ok) {
    throw new Error(`Http error! status ${request.status}`);
  }
  const response: WidgetList = await request.json();
  const posts = response.list_widgets.filter(
    (w) => w.widget_type === "POST_ROW"
  );
  const decoratedPosts = posts.map((post) => {
    return {
      title: post.data.title,
      image_url: post.data.image_url,
      bottom_description_text: post.data.bottom_description_text,
      middle_description_text: post.data.middle_description_text,
      top_description_text: post.data.top_description_text,
      token: post.data.token,
    };
  });
  console.log(decoratedPosts);
  let config = await prisma.config.findFirst({
    where: {
      id: 1,
    },
  });
  if (!config) {
    config = await prisma.config.create({
      data: {
        id: 1,
        lastPostId: decoratedPosts[0].token,
      },
    });
    console.log(decoratedPosts[0]);
  }
  if (config.lastPostId !== decoratedPosts[0].token || true) {
    bot.sendPhoto(
      process.env.TELEGRAM_CHAT_ID || "",
      decoratedPosts[0].image_url,
      {
        caption: `
        <b>${decoratedPosts[0].title}</b>
        ${decoratedPosts[0].top_description_text}
        ${decoratedPosts[0].middle_description_text}
        ${decoratedPosts[0].bottom_description_text}
        <a href="https://divar.ir/v/${decoratedPosts[0].title.replace(
          " ",
          "-"
        )}/${decoratedPosts[0].token}">لینک دیوار</a>
        `,
        parse_mode: "HTML",
      }
    );

    console.log(decoratedPosts[0]);
  }
}

(() => {
  setInterval(() => {
    fetchData(process.env.CITY_ID || "1");
  }, 5000);
})();
