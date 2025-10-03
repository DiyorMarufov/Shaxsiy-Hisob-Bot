import { Bot, session } from "grammy";
import { conversations } from "@grammyjs/conversations";
import { MyContext, initialSession } from "../types";

import addExpenseCommand from "./commands/add-expense";
import startCommand from "./commands/start";
import { createTables } from "./migrations/createTables";
import addIncomeCommand from "./commands/add-income";
import balanceCommand from "./commands/balance";
import reportCommand from "./commands/report";
import notifyMiddleware from "./commands/notify";
import setLimitCommand from "./commands/set-limit";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

bot.use(session({ initial: initialSession }));
bot.use(conversations());

createTables();

startCommand(bot);
addExpenseCommand(bot);
addIncomeCommand(bot);
balanceCommand(bot);
reportCommand(bot);
setLimitCommand(bot);

bot.use(notifyMiddleware());

export { bot };
