import { MyContext } from "../../types";
import { query } from "../services/db";

export default function notifyMiddleware() {
  return async (ctx: MyContext, next: () => Promise<void>) => {
    await next();

    try {
      const { rows: settings } = await query(
        `SELECT expense_limit, notify FROM settings WHERE chat_id=$1`,
        [ctx.chat?.id]
      );

      if (settings.length > 0 && settings[0].notify) {
        const { rows: totalExpense } = await query(
          `SELECT COALESCE(SUM(amount),0) as total_expense FROM expenses WHERE chat_id=$1`,
          [ctx.chat?.id]
        );

        const limit = parseFloat(settings[0].expense_limit);
        const total = parseFloat(totalExpense[0].total_expense);

        if (total >= limit) {
          await ctx.reply(
            `⚠️ Diqqat! Xarajatlaringiz belgilangan limitdan oshib ketdi!`
          );
        }
      }
    } catch (error) {
      console.error("Notify error:", error);
    }
  };
}
