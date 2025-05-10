import { bot } from "../bot";
import { Messages } from "../constants";
import { Handler } from "./handler";

import * as fs from "fs";
export const educationHandler: Handler = async (message) => {
  await bot.sendVideo(
    message.chat.id,
    fs.createReadStream("./public/tutorial.MP4"),
    {
      caption: Messages.EDUCATION_TEXT,
    }
  );
};
