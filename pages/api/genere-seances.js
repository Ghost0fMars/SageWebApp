// pages/api/generateDetailedSessions.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Méthode non autorisée' });
    return;
  }

  const { sequence } = req.body;

  if (!sequence || sequence.trim() === '') {
    res.status(400).json({ message: 'La progression de la séquence est manquante.' });
    return;
  }

  // Crée le prompt pour l'IA
  const prompt = `
À partir de la progression suivante :

"${sequence}"

Pour chaque séance identifiée, génère un contenu détaillé avec les phases suivantes :
1️⃣ Phase d'introduction : objectif, activités proposées, matériel.
2️⃣ Phase de recherche : objectif, activités proposées, matériel.
3️⃣ Phase de mise en commun : objectif, activités proposées, matériel.
4️⃣ Phase de synthèse et institutionnalisation : objectif, activités proposées, matériel, trace écrite.

Présente la réponse sous forme structurée et lisible.
`;

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // ou "gpt-3.5-turbo" si tu veux la version gratuite
        messages: [
          { role: 'system', content: 'Tu es un expert en pédagogie. Sois clair, structuré et précis.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    res.status(200).json({ resultat: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la génération des séances.' });
  }
}
