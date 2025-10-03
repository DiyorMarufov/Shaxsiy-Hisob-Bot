import { Bot } from "grammy";
import { BOT_TOKEN } from "./config";
import startCommand from "./commands/start";

const bot = new Bot(BOT_TOKEN);

// Commands
startCommand(bot);

export default bot;
