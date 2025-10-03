import { Bot } from "grammy";
import { MyContext } from "../../types";
import { query } from "../services/db";

export default function startCommand(bot: Bot<MyContext>) {
  bot.command("start", async (ctx) => {
    try {
      await query(
        `INSERT INTO users(chat_id, username) VALUES($1, $2)
         ON CONFLICT (chat_id) DO NOTHING`,
        [ctx.chat?.id, ctx.from?.username || ctx.from?.first_name]
      );

      await ctx.reply(
        "👋 Salom! Men sizning shaxsiy moliyaviy hisob botingizman.\n\n" +
          "Quyidagi komandalar orqali foydalanishingiz mumkin:\n\n" +
          "📌 /add_expense – Xarajat qo‘shish\n" +
          "📌 /add_income – Daromad qo‘shish\n" +
          "📌 /balance – Balansni ko‘rish\n" +
          "📌 /report – Hisobot olish\n" +
          "📌 /set_limit – Chegara (limit) qo‘yish\n"
      );
    } catch (err) {
      console.error(err);
      await ctx.reply("❌ Botni ishga tushirishda xatolik yuz berdi");
    }
  });
}
