import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

function DraggableTile({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {children}
    </div>
  );
}

function DroppableCell({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver ? '#e0f7fa' : '#fff',
  };

  return (
    <td ref={setNodeRef} className="cellule" style={style}>
      {children}
    </td>
  );
}

export default function EmploiDuTemps() {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const heures = [
    "8h30", "9h00", "9h30", "10h30", "11h00", 
    "11h30", "13h30", "14h30", "15h00", "15h30", "16h30"
  ];

  const [sequenceTexte, setSequenceTexte] = useState('');
  const [tilesData, setTilesData] = useState([]);
  const [placements, setPlacements] = useState({});

  useEffect(() => {
    fetch('/api/genere-seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sequence: `Séance 1 - Dénombrer les objets
Séance 2 - Associer une collection au bon nombre
Séance 3 - Comparer des collections
Séance 4 - Utiliser les signes <, >, =
Séance 5 - Résoudre des petits problèmes de quantités`
      })
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setSequenceTexte(data.resultat);

        const lignes = data.resultat
          .split('\n')
          .filter(l => l.trim() !== '')
          .filter((l, i) => i !== 0 || l.toLowerCase().includes('séance'));

        const tuiles = [];
        let current = null;
        lignes.forEach(l => {
          if (l.toLowerCase().includes('séance')) {
            if (current) tuiles.push(current);
            current = {
              id: String(tuiles.length + 1),
              nomSeance: l.trim(),
              objectif: '',
              consigne: ''
            };
          } else if (l.toLowerCase().startsWith('objectif')) {
            current.objectif = l.split(':')[1]?.trim() || '';
          } else if (l.toLowerCase().startsWith('consigne')) {
            current.consigne = l.split(':')[1]?.trim() || '';
          }
        });
        if (current) tuiles.push(current);
        setTilesData(tuiles);
      })
      .catch(err => {
        console.error('Erreur API :', err);
        setSequenceTexte('Erreur : impossible de charger la séquence.');
      });
  }, []);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over) {
      setPlacements(prev => ({
        ...prev,
        [over.id]: tilesData.find(tile => tile.id === active.id),
      }));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="emploi-du-temps">
        <div className="flex">
          <div className="bibliotheque-tuiles">
            <h2 className="titre mb-4" style={{ textAlign: 'center' }}>Mes tuiles</h2>
            <div className="space-y-4">
              {tilesData
                .filter(tile => !Object.values(placements).some(p => p?.id === tile.id))
                .map(tile => (
                  <DraggableTile key={tile.id} id={tile.id}>
                    <div className="tuile whitespace-pre-wrap">
                      <p className="font-semibold">{tile.nomSeance}</p>
                      <p><strong>Objectif :</strong> {tile.objectif}</p>
                      <p><strong>Consigne :</strong> {tile.consigne}</p>
                    </div>
                  </DraggableTile>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <h2 className="titre mb-4" style={{ textAlign: 'center' }}>Emploi du temps</h2>
            <table className="emploi-table">
              <colgroup>
                <col className="heure" />
                <col span="5" />
              </colgroup>
              <thead>
                <tr>
                  <th className="heure">Heure</th>
                  {jours.map(jour => (
                    <th key={jour}>{jour}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.map(heure => (
                  <tr key={heure}>
                    <td className="heure">{heure}</td>
                    {jours.map(jour => {
                      const cellId = `${jour}-${heure}`;
                      const content = placements[cellId];
                      return (
                        <DroppableCell key={cellId} id={cellId}>
                          {content && (
                            <div className="tuile whitespace-pre-wrap">
                              <strong>{content.nomSeance}</strong><br />
                              <em>{content.objectif}</em>
                            </div>
                          )}
                        </DroppableCell>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
