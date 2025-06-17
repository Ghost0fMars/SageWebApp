/*
  Warnings:

  - You are about to alter the column `content` on the `Sequence` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sequence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sequence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sequence" ("content", "createdAt", "id", "title", "userId") SELECT "content", "createdAt", "id", "title", "userId" FROM "Sequence";
DROP TABLE "Sequence";
ALTER TABLE "new_Sequence" RENAME TO "Sequence";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
