import { Bot } from "grammy";
import { MyContext } from "../../types";
import { query } from "../services/db";

export default function reportCommand(bot: Bot<MyContext>) {
  bot.command("report", async (ctx) => {
    try {
      const { rows: expenses } = await query(
        `SELECT category, SUM(amount) as total 
         FROM expenses 
         WHERE chat_id=$1 
         AND created_at >= date_trunc('month', CURRENT_DATE)
         GROUP BY category`,
        [ctx.chat?.id]
      );

      const { rows: income } = await query(
        `SELECT COALESCE(SUM(amount),0) as total_income 
         FROM incomes 
         WHERE chat_id=$1 
         AND created_at >= date_trunc('month', CURRENT_DATE)`,
        [ctx.chat?.id]
      );

      const { rows: totalExpense } = await query(
        `SELECT COALESCE(SUM(amount),0) as total_expense 
         FROM expenses 
         WHERE chat_id=$1 
         AND created_at >= date_trunc('month', CURRENT_DATE)`,
        [ctx.chat?.id]
      );

      let reportText = "📊 Oylik hisobot:\n\n";
      expenses.forEach((row) => {
        reportText += `• ${row.category}: ${row.total}\n`;
      });

      reportText += `\n💵 Umumiy daromad: ${income[0].total_income}`;
      reportText += `\n💸 Umumiy xarajat: ${totalExpense[0].total_expense}`;
      reportText += `\n💰 Sof balans: ${
        income[0].total_income - totalExpense[0].total_expense
      }`;

      await ctx.reply(reportText);
    } catch (error) {
      console.error(error);
      await ctx.reply("Hisobotni chiqarishda xatolik ❌");
    }
  });
}
