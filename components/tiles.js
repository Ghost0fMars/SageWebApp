export default function Tile({ sousDomaine, titreSequence, nomSeance, objectif, consigne }) {
  return (
    <div className="tile">
      <h3 className="tile-title">{nomSeance}</h3>
      <p><strong>Sous-domaine :</strong> {sousDomaine}</p>
      <p><strong>Titre :</strong> {titreSequence}</p>
      <p><strong>Objectif :</strong> {objectif}</p>
      <p><strong>Consigne :</strong> {consigne}</p>
    </div>
  );
}
