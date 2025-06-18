export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  const { competence, titre, domaine, sousDomaine } = req.body;

  if (!competence || !titre || !domaine || !sousDomaine) {
    return res.status(400).json({ message: 'Données manquantes.' });
  }

  // ✅ Prompt super robuste pour structure découpable
  const prompt = `
Tu es un expert en pédagogie. À partir de la compétence suivante :
"${competence}"

Rédige une progression pour une séquence intitulée "${titre}" 
du domaine "${domaine}" et du sous-domaine "${sousDomaine}" en 5 séances.

Structure ta réponse STRICTEMENT au format suivant :

Séquence en 5 séances :
1. Titre : [titre de la séance 1]
   Objectif : [objectif de la séance 1]
   Consigne : [consigne de la séance 1]

2. Titre : [titre de la séance 2]
   Objectif : [objectif de la séance 2]
   Consigne : [consigne de la séance 2]

3. Titre : [titre de la séance 3]
   Objectif : [objectif de la séance 3]
   Consigne : [consigne de la séance 3]

4. Titre : [titre de la séance 4]
   Objectif : [objectif de la séance 4]
   Consigne : [consigne de la séance 4]

5. Titre : [titre de la séance 5]
   Objectif : [objectif de la séance 5]
   Consigne : [consigne de la séance 5]

Ne change pas ce format. Ne fais pas de paragraphes narratifs. Sois clair, précis et concis.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ou gpt-4 si dispo
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
