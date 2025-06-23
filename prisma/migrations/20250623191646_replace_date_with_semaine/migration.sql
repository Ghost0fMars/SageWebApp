/*
  Warnings:

  - You are about to drop the column `date` on the `Seance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seance" DROP COLUMN "date",
ADD COLUMN     "semaine" TIMESTAMP(3);
