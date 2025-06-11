import prisma from "@/lib/prisma"; // adapte le chemin selon ton projet

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  try {
    await prisma.seance.updateMany({
      data: { position: "sidebar" }
    });
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la réinitialisation" });
  }
}