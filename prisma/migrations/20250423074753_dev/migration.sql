/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `promos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "promos_code_key" ON "promos"("code");
