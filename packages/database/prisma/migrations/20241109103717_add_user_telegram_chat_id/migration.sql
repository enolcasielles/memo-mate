/*
  Warnings:

  - Added the required column `telegram_chat_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "telegram_chat_id" BIGINT;
UPDATE "users" SET "telegram_chat_id" = -1;
ALTER TABLE "users" ALTER COLUMN "telegram_chat_id" SET NOT NULL;
