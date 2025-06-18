/*
  Warnings:

  - The primary key for the `Seance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[title]` on the table `Sequence` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    "sequenceId" TEXT NOT NULL,
    CONSTRAINT "Seance_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Seance" ("id", "objectif", "sequenceId", "title") SELECT "id", "objectif", "sequenceId", "title" FROM "Seance";
DROP TABLE "Seance";
ALTER TABLE "new_Seance" RENAME TO "Seance";
CREATE TABLE "new_Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "objectif" TEXT,
    "position" TEXT NOT NULL,
    "couleur" TEXT,
    "seanceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tile_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "Seance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tile" ("couleur", "createdAt", "id", "objectif", "position", "seanceId", "titre", "userId") SELECT "couleur", "createdAt", "id", "objectif", "position", "seanceId", "titre", "userId" FROM "Tile";
DROP TABLE "Tile";
ALTER TABLE "new_Tile" RENAME TO "Tile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Sequence_title_key" ON "Sequence"("title");
