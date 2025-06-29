/*
  Warnings:

  - You are about to drop the column `consigne` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `detailed` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `objectif` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `semaine` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Seance` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Sequence` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedPassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sequence_title_key";

-- AlterTable
ALTER TABLE "Seance" DROP COLUMN "consigne",
DROP COLUMN "detailed",
DROP COLUMN "objectif",
DROP COLUMN "position",
DROP COLUMN "semaine",
DROP COLUMN "subtitle",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Sequence" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "createdAt",
DROP COLUMN "grade",
DROP COLUMN "hashedPassword",
DROP COLUMN "isVisible",
DROP COLUMN "phone",
DROP COLUMN "profileImage",
DROP COLUMN "role",
DROP COLUMN "school",
DROP COLUMN "subject";

-- CreateTable
CREATE TABLE "Profil" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "school" TEXT,
    "academy" TEXT,
    "grade" TEXT,
    "bio" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "allowMessages" BOOLEAN NOT NULL DEFAULT true,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profil_userId_key" ON "Profil"("userId");

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
