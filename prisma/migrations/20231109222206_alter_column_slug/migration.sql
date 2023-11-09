/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `recipients` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `recipients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipients" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recipients_slug_key" ON "recipients"("slug");
