/*
  Warnings:

  - You are about to drop the column `messagerieAcademique` on the `Profil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profil" DROP COLUMN "messagerieAcademique",
ADD COLUMN     "messagerie" TEXT;
