import { Bot } from "grammy";
import {
  createConversation,
  ConversationBuilder,
} from "@grammyjs/conversations";
import { MyContext } from "../../types";
import { query } from "../services/db";

const addExpenseConversation: ConversationBuilder<
  MyContext,
  MyContext
> = async (conversation, ctx) => {
  await ctx.reply("Xarajat nomini kiriting:");
  const expenseNameMsg = await conversation.waitFor("message:text");
  const name = expenseNameMsg.message.text!;

  if (!expenseNameMsg) {
    await ctx.reply("Xarajatni kiritmadingiz!");
    return;
  }

  await ctx.reply("Summasini kiriting:");
  const expenseSumMsg = await conversation.waitFor("message:text");
  const totalSum = parseFloat(expenseSumMsg.message.text!);

  if (!expenseSumMsg) {
    await ctx.reply("Summani kiritmadingiz!");
    return;
  }

  await ctx.reply(
    "Kategoriyani tanlang (oziq-ovqat, transport, ko‘ngilochar):"
  );
  const categoryMsg = await conversation.waitFor("message:text");
  const category = categoryMsg.message.text!;

  if (!categoryMsg) {
    await ctx.reply("Kategorini kiritmadingiz!");
    return;
  }

  try {
    await query(
      `INSERT INTO users(chat_id, username) VALUES($1, $2) ON CONFLICT (chat_id) DO NOTHING`,
      [ctx.chat?.id, ctx.from?.username || ctx.from?.first_name]
    );

    await query(
      `INSERT INTO expenses(chat_id, name, amount, category) VALUES($1, $2, $3, $4)`,
      [ctx.chat?.id, name, totalSum, category]
    );

    await ctx.reply("Xarajat saqlandi ✅");
  } catch (error) {
    console.error(error);
    await ctx.reply("Xatolik yuz berdi ❌");
  }
};

export default function addExpenseCommand(bot: Bot<MyContext>) {
  bot.use(createConversation(addExpenseConversation));

  bot.command("add_expense", async (ctx) => {
    await ctx.conversation.enter("addExpenseConversation");
  });
}
