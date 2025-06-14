let seances = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(seances);
  } else if (req.method === 'POST') {
    const seance = req.body;
    // Ajoute un id unique
    seance.id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    seances.push(seance);
    res.status(201).json(seance);
  } else if (req.method === 'PATCH') {
    const { id } = req.query;
    const { position } = req.body;
    const idx = seances.findIndex(s => s.id === id);
    if (idx !== -1) {
      seances[idx].position = position;
      res.status(200).json(seances[idx]);
    } else {
      res.status(404).json({ message: "Séance non trouvée" });
    }
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}