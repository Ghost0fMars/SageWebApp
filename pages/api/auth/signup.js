import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma'; // Ton instance Prisma

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword, // ✅ Ici on met bien "hashedPassword" pour correspondre au modèle
      },
    });

    return res.status(200).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
