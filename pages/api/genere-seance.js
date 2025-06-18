export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { objectif, competence } = req.body;

  const prompt = `
Compétence de la séquence : ${competence}

Objectif de la séance : ${objectif}

Génère une séance d'apprentissage complète et détaillée en suivant ces consignes :

- Organise la séance en 5 phases inspirées de la démarche explicite :
  1) Introduction
  2) Recherche
  3) Mise en commun
  4) Institutionnalisation
  5) Synthèse

- Pour chaque phase, décris :
  - Les gestes, questions et explications de l’enseignant.
  - Les actions concrètes des élèves (individuel, binôme, groupe).
  - Des exemples de supports ou outils.

- Indique pour chaque phase :
  - Les critères de réussite clairs pour les élèves.
  - Les critères de réalisation pour l’évaluation par l’enseignant.

- Utilise un ton clair, précis, directement exploitable.

- Format final : **RENVOIE UNIQUEMENT le HTML structuré avec <h2>, <h3>, <p>, <ul>.**
- NE MET PAS DE \`\`\`html ou de triple backticks.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant pédagogique. Tu dois répondre UNIQUEMENT en HTML pur, sans bloc de code Markdown, sans triple backticks."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "Pas de réponse de l'IA." });
    }

    // ✅ Nettoyage béton :
    let resultat = data.choices[0].message.content;

    // 1) Supprimer ```html ou ```
    resultat = resultat.replace(/```html/gi, '').replace(/```/g, '').trim();

    // 2) Supprimer un éventuel doublon de titre au tout début
    resultat = resultat.replace(/^(Séance d'apprentissage[^]+?)Séance d'apprentissage/, 'Séance d\'apprentissage');

    // 3) Trim final pour la propreté
    resultat = resultat.trim();

    res.status(200).json({ resultat });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
