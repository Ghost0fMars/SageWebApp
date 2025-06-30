-- CreateTable
CREATE TABLE "Eleve" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dateNaissance" TEXT,
    "parentNom" TEXT,
    "parentTel" TEXT,
    "parentEmail" TEXT,
    "documents" JSONB NOT NULL,
    "besoinsParticuliers" JSONB NOT NULL,
    "notes" TEXT,
    "evaluations" JSONB NOT NULL,

    CONSTRAINT "Eleve_pkey" PRIMARY KEY ("id")
);
