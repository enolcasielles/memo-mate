
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { KeyedDistinct } from "telegraf/typings/core/helpers/util";
import { Context, NarrowedContext } from "telegraf";

export type TextMessageContext = NarrowedContext<Context<Update>, Update.MessageUpdate<KeyedDistinct<Message, "text">>>;
