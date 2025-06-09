// pages/api/auth/login.js
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // À ce stade, l'utilisateur est authentifié
    return res.status(200).json({ message: 'Connexion réussie', user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Erreur de connexion utilisateur :', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
