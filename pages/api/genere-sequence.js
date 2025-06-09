export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { competence } = req.body;

  if (!competence) {
    return res.status(400).json({ message: 'Compétence manquante.' });
  }

  const prompt = `
Tu es un expert en pédagogie. À partir de la compétence suivante :
"${competence}"
1️⃣ Génère un objectif clair d'apprentissage.
2️⃣ Propose une séquence en 5 séances : découverte, apprentissage, entraînement, synthèse, évaluation.
Pour chaque séance, donne :
- Un titre
- La consigne pour les élèves
- Les activités principales
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ou gpt-4 si tu as accès
        messages: [
          { role: 'system', content: 'Tu es un assistant pédagogique créatif.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ message: 'Aucune réponse reçue de l’IA.' });
    }

    res.status(200).json({ resultat: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la génération.' });
  }
}
