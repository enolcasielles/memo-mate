/*
  Warnings:

  - You are about to drop the column `openai_assistant_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `openai_thread_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "openai_assistant_id",
ADD COLUMN     "openai_thread_id" TEXT;

UPDATE "users" SET "openai_thread_id" = 'INVALID_THREAD_ID';

ALTER TABLE "users" ALTER COLUMN "openai_thread_id" SET NOT NULL;
