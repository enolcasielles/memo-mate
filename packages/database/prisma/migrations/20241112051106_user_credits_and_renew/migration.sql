/*
  Warnings:

  - A unique constraint covering the columns `[stripe_subscription_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "credits" INTEGER,
ADD COLUMN "renew_at" TIMESTAMP(3);

-- UpdateTable 
UPDATE "users" SET 
"credits" = 0,
"renew_at" = CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" 
ALTER COLUMN "credits" SET NOT NULL,
ALTER COLUMN "renew_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "users_renew_at_idx" ON "users"("renew_at");
