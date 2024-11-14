/*
  Warnings:

  - Changed the type of `direction` on the `message_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INCOMING', 'OUTGOING');

-- AlterTable
ALTER TABLE "message_logs" DROP COLUMN "direction",
ADD COLUMN     "direction" "MessageDirection" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "credits" SET DEFAULT 0,
ALTER COLUMN "renew_at" DROP NOT NULL,
ALTER COLUMN "renew_at" SET DEFAULT CURRENT_TIMESTAMP;
