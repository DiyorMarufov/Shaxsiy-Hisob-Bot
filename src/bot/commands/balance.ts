import { Bot } from "grammy";
import { MyContext } from "../../types";
import { query } from "../services/db";

export default function balanceCommand(bot: Bot<MyContext>) {
  bot.command("balance", async (ctx) => {
    try {
      const { rows: incomeRows } = await query(
        `SELECT COALESCE(SUM(amount),0) as total_income FROM incomes WHERE chat_id=$1`,
        [ctx.chat?.id]
      );
      const { rows: expenseRows } = await query(
        `SELECT COALESCE(SUM(amount),0) as total_expense FROM expenses WHERE chat_id=$1`,
        [ctx.chat?.id]
      );

      const totalIncome = parseFloat(incomeRows[0].total_income) || 0;
      const totalExpense = parseFloat(expenseRows[0].total_expense) || 0;
      const balance = totalIncome - totalExpense;

      await ctx.reply(
        `💰 Balansingiz:\nDaromad: ${totalIncome}\nXarajat: ${totalExpense}\nSof balans: ${balance}`
      );
    } catch (error) {
      console.error(error);
      await ctx.reply("Balansni olishda xatolik ❌");
    }
  });
}
