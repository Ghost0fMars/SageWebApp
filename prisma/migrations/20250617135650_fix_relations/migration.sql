-- CreateTable
CREATE TABLE "Seance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sequenceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objectif" TEXT NOT NULL,
    CONSTRAINT "Seance_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "Sequence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "objectif" TEXT,
    "position" TEXT NOT NULL,
    "couleur" TEXT,
    "seanceId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tile_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "Seance" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tile" ("couleur", "createdAt", "id", "objectif", "position", "seanceId", "titre", "userId") SELECT "couleur", "createdAt", "id", "objectif", "position", "seanceId", "titre", "userId" FROM "Tile";
DROP TABLE "Tile";
ALTER TABLE "new_Tile" RENAME TO "Tile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
