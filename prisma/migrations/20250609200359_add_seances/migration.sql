-- CreateTable
CREATE TABLE "Seance" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "couleur" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Seance_pkey" PRIMARY KEY ("id")
);
