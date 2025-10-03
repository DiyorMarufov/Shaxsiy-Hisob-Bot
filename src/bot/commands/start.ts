import { Bot } from "grammy";

export default function startCommand(bot: Bot) {
  bot.command("start", async (ctx) => {
    await ctx.reply("Salom! Men sizning botingizman 🤖");
  });
}
