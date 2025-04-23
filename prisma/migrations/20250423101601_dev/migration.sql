/*
  Warnings:

  - You are about to drop the column `address_line_1` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_2` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `postal_code` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_name` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[snapshot_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `snapshot_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "address_line_1",
DROP COLUMN "address_line_2",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "created_at",
DROP COLUMN "phone_number",
DROP COLUMN "postal_code",
DROP COLUMN "province",
DROP COLUMN "recipient_name",
DROP COLUMN "updated_at",
ADD COLUMN     "snapshot_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "order_address_snapshots" (
    "id" TEXT NOT NULL,
    "recipient_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "sub_district" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(5) NOT NULL,

    CONSTRAINT "order_address_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_snapshot_id_key" ON "orders"("snapshot_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "order_address_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
