/*
  Warnings:

  - You are about to drop the column `neightborhood` on the `recipients` table. All the data in the column will be lost.
  - Added the required column `neighborhood` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "neightborhood",
ADD COLUMN     "neighborhood" TEXT NOT NULL;
