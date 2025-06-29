/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `competence` on the `Sequence` table. All the data in the column will be lost.
  - You are about to drop the column `domaine` on the `Sequence` table. All the data in the column will be lost.
  - You are about to drop the column `progression` on the `Sequence` table. All the data in the column will be lost.
  - You are about to drop the column `sousDomaine` on the `Sequence` table. All the data in the column will be lost.
  - You are about to drop the `Profil` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Sequence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `objectif` to the `Seance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Sequence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profil" DROP CONSTRAINT "Profil_userId_fkey";

-- AlterTable
ALTER TABLE "Seance" DROP COLUMN "createdAt",
DROP COLUMN "description",
ADD COLUMN     "consigne" TEXT,
ADD COLUMN     "detailed" TEXT,
ADD COLUMN     "objectif" TEXT NOT NULL,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "semaine" TIMESTAMP(3),
ADD COLUMN     "subtitle" TEXT;

-- AlterTable
ALTER TABLE "Sequence" DROP COLUMN "competence",
DROP COLUMN "domaine",
DROP COLUMN "progression",
DROP COLUMN "sousDomaine",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "hashedPassword" DROP NOT NULL;

-- DropTable
DROP TABLE "Profil";

-- CreateIndex
CREATE UNIQUE INDEX "Sequence_title_key" ON "Sequence"("title");
