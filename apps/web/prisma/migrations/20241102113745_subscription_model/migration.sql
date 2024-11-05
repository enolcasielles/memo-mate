/*
  Warnings:

  - You are about to drop the column `stripe_subscription_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_subscription_id",
ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "stripe_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'none',
    "stripe_customer_id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripe_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_subscriptions_user_id_key" ON "stripe_subscriptions"("user_id");

-- AddForeignKey
ALTER TABLE "stripe_subscriptions" ADD CONSTRAINT "stripe_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
