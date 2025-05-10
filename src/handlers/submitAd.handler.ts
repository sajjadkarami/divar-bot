import { userState } from "..";
import { bot } from "../bot";
import { State } from "../dto/state.enum";
import { Handler } from "./handler";
import { Buttons } from "./start.handler";

export const submitAdHandler: Handler = async (message) => {
  userState[message.chat.id] = State.SEND_QUERY;
  await bot.sendMessage(message.chat.id, "لطفا لینک مورد نظر را ارسال نمایید", {
    reply_markup: {
      keyboard: [[{ text: Buttons.Back }]],
    },
  });
};
