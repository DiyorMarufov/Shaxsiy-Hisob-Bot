import { Context, SessionFlavor } from "grammy";
import { ConversationFlavor } from "@grammyjs/conversations";

export interface MySession {
  __conversation?: unknown;
}

export const initialSession = (): MySession => ({});

export type MyContext = Context &
  SessionFlavor<MySession> &
  ConversationFlavor<Context & SessionFlavor<MySession>>;
