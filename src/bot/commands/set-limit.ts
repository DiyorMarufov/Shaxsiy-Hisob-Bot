import { Bot } from "grammy";
import { MyContext } from "../../types";
import { query } from "../services/db";

export default function setLimitCommand(bot: Bot<MyContext>) {
  bot.command("set_limit", async (ctx) => {
    const args = ctx.match;
    const limit = parseFloat(args);
  
    if (isNaN(limit)) {
      await ctx.reply(
        "❌ Limit noto‘g‘ri kiritildi. Masalan: /set_limit 50000"
      );
      return;
    }

    try {
      await query(
        `INSERT INTO settings (chat_id, expense_limit, notify)
         VALUES ($1, $2, true)
         ON CONFLICT (chat_id) DO UPDATE SET expense_limit=$2, notify=true`,
        [ctx.chat?.id, limit]
      );

      await ctx.reply(`✅ Xarajat limiti ${limit} so‘m qilib belgilandi`);
    } catch (err) {
      console.error(err);
      await ctx.reply("❌ Limitni belgilashda xatolik yuz berdi");
    }
  });
}
