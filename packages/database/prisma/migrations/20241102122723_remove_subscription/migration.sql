/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `stripe_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stripe_subscriptions" DROP CONSTRAINT "stripe_subscriptions_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ADD COLUMN     "stripe_subscription_id" TEXT;

-- DropTable
DROP TABLE "stripe_subscriptions";
