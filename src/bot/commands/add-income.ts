import { Bot } from "grammy";
import {
  createConversation,
  ConversationBuilder,
} from "@grammyjs/conversations";
import { MyContext } from "../../types";
import { query } from "../services/db";

const addIncomeConversation: ConversationBuilder<MyContext, MyContext> = async (
  conversation,
  ctx
) => {
  await ctx.reply("Daromad manbasini kiriting:");
  const sourceMsg = await conversation.waitFor("message:text");
  const source = sourceMsg.message.text!;

  await ctx.reply("Summani kiriting:");
  const incomeMsg = await conversation.waitFor("message:text");
  const amount = parseFloat(incomeMsg.message.text!);

  try {
    await query(
      `INSERT INTO users(chat_id, username) VALUES($1, $2) ON CONFLICT (chat_id) DO NOTHING`,
      [ctx.chat?.id, ctx.from?.username || ctx.from?.first_name]
    );

    await query(
      `INSERT INTO incomes(chat_id, source, amount) VALUES($1, $2, $3)`,
      [ctx.chat?.id, source, amount]
    );

    await ctx.reply("Daromad qo‘shildi ✅");
  } catch (error) {
    console.error(error);
    await ctx.reply("Xatolik yuz berdi ❌");
  }
};

export default function addIncomeCommand(bot: Bot<MyContext>) {
  bot.use(createConversation(addIncomeConversation));

  bot.command("add_income", async (ctx) => {
    await ctx.conversation.enter("addIncomeConversation");
  });
}
