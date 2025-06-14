/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "Session_sessionToken_key";

-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Account";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerificationToken";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sequence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "objectif" TEXT,
    "consigne" TEXT,
    "domaine" TEXT,
    "couleur" TEXT,
    "position" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Seance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Seance" ("couleur", "createdAt", "domaine", "id", "position", "titre", "userId") SELECT "couleur", "createdAt", "domaine", "id", "position", "titre", "userId" FROM "Seance";
DROP TABLE "Seance";
ALTER TABLE "new_Seance" RENAME TO "Seance";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "hashedPassword" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "hashedPassword", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "hashedPassword", "id", "name", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
