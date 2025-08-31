import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

export default function Formulaire() {
  const [competences, setCompetences] = useState([]);

  // --- Sélections utilisateur ---
  const [selectedCycle, setSelectedCycle] = useState('1');     // "1" | "2" | "3"
  const [selectedNiveau, setSelectedNiveau] = useState('');    // ex: "CP", "CE1", "PS", ...
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [selectedSousDomaine, setSelectedSousDomaine] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [titre, setTitre] = useState('');

  // --- Listes dérivées ---
  const [niveaux, setNiveaux] = useState([]);          // options de niveau selon le cycle
  const [sousDomaines, setSousDomaines] = useState([]); // options de sous-domaine
  const [items, setItems] = useState([]);               // options d'item
  const [filteredCompetences, setFilteredCompetences] = useState([]); // résultats finaux

  const router = useRouter();

  // Chargement du JSON (côté client)
  useEffect(() => {
    fetch('/data/competences.json')
      .then((res) => res.json())
      .then((data) => setCompetences(data))
      .catch((error) => console.error('Erreur chargement JSON:', error));
  }, []);

  // Domaines disponibles (dépendent désormais du Cycle ET du Niveau sélectionnés)
  const getDomaines = () => {
    const filtered = competences.filter(item =>
      item.Cycle === `Cycle ${selectedCycle}` &&
      (selectedNiveau ? item.Niveau === selectedNiveau : true)
    );
    return [...new Set(filtered.map(item => item.Domaine))];
  };

  // --- Handlers ---

  const handleCycleChange = (e) => {
    const cycle = e.target.value;
    setSelectedCycle(cycle);

    // Met à jour les niveaux possibles pour ce cycle
    const niv = [
      ...new Set(
        competences
          .filter(it => it.Cycle === `Cycle ${cycle}`)
          .map(it => it.Niveau)
      ),
    ].sort();
    setNiveaux(niv);

    // Reset de tout ce qui est en-dessous
    setSelectedNiveau('');
    setSelectedDomaine('');
    setSousDomaines([]);
    setSelectedSousDomaine('');
    setItems([]);
    setSelectedItem('');
    setFilteredCompetences([]);
    setSelectedCompetence('');
  };

  const handleNiveauChange = (e) => {
    const niveau = e.target.value;
    setSelectedNiveau(niveau);

    // Reset des sélections inférieures
    setSelectedDomaine('');
    setSousDomaines([]);
    setSelectedSousDomaine('');
    setItems([]);
    setSelectedItem('');
    setFilteredCompetences([]);
    setSelectedCompetence('');
  };

  const handleDomaineChange = (e) => {
    const domaine = e.target.value;
    setSelectedDomaine(domaine);

    const filtered = competences.filter(
      item =>
        item.Cycle === `Cycle ${selectedCycle}` &&
        (selectedNiveau ? item.Niveau === selectedNiveau : true) &&
        item.Domaine === domaine
    );
    const uniqueSousDomaines = [...new Set(filtered.map(item => item['Sous-domaine']))];
    setSousDomaines(uniqueSousDomaines.sort());

    setSelectedSousDomaine('');
    setItems([]);
    setSelectedItem('');
    setFilteredCompetences([]);
    setSelectedCompetence('');
  };

  const handleSousDomaineChange = (e) => {
    const sousDomaine = e.target.value;
    setSelectedSousDomaine(sousDomaine);

    const filtered = competences.filter(
      item =>
        item.Cycle === `Cycle ${selectedCycle}` &&
        (selectedNiveau ? item.Niveau === selectedNiveau : true) &&
        item.Domaine === selectedDomaine &&
        item['Sous-domaine'] === sousDomaine
    );
    const uniqueItems = [...new Set(filtered.map(item => item.Item))];
    setItems(uniqueItems.sort());

    setSelectedItem('');
    setFilteredCompetences([]);
    setSelectedCompetence('');
  };

  const handleItemChange = (e) => {
    const item = e.target.value;
    setSelectedItem(item);

    const filtered = competences.filter(
      c =>
        c.Cycle === `Cycle ${selectedCycle}` &&
        (selectedNiveau ? c.Niveau === selectedNiveau : true) &&
        c.Domaine === selectedDomaine &&
        c['Sous-domaine'] === selectedSousDomaine &&
        c.Item === item
    );
    setFilteredCompetences(filtered);
    setSelectedCompetence('');
  };

  const handleCompetenceClick = (competence) => {
    setSelectedCompetence(competence);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCompetence || !titre) {
      alert("Merci de remplir la compétence et le titre de la séance.");
      return;
    }

    router.push({
      pathname: '/sequence',
      query: {
        competence: selectedCompetence,
        titre,
        cycle: `Cycle ${selectedCycle}`,
        niveau: selectedNiveau,
        domaine: selectedDomaine,
        sousDomaine: selectedSousDomaine
      }
    });
  };

  // Met à jour la liste des niveaux au premier rendu (quand le JSON est dispo)
  useEffect(() => {
    if (!competences.length) return;
    const niv = [
      ...new Set(
        competences
          .filter(it => it.Cycle === `Cycle ${selectedCycle}`)
          .map(it => it.Niveau)
      ),
    ].sort();
    setNiveaux(niv);
  }, [competences, selectedCycle]);

  return (
    <>
      <Header/>
      <div className="container">
        <h1>
          Créer une <span className="accent">séquence</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {/* CYCLE */}
          <label htmlFor="cycle">Choisissez le cycle :</label>
          <select
            id="cycle"
            name="cycle"
            value={selectedCycle}
            onChange={handleCycleChange}
            style={{ marginBottom: '1rem', display: 'block' }}
          >
            <option value="1">Cycle 1 (Maternelle)</option>
            <option value="2">Cycle 2 (CP, CE1, CE2)</option>
            <option value="3">Cycle 3 (CM1, CM2, 6e)</option>
          </select>

          {/* NIVEAU (nouveau) */}
          <label htmlFor="niveau">Niveau :</label>
          <select
            id="niveau"
            name="niveau"
            value={selectedNiveau}
            onChange={handleNiveauChange}
            disabled={!niveaux.length}
            style={{ marginBottom: '1rem', display: 'block' }}
          >
            <option value="">
              {niveaux.length ? '--Choisissez un niveau--' : 'Sélectionnez un cycle d’abord'}
            </option>
            {niveaux.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* DOMAINE */}
          <label htmlFor="domaine">Domaine :</label>
          <select
            id="domaine"
            name="domaine"
            onChange={handleDomaineChange}
            value={selectedDomaine}
            disabled={!selectedNiveau}
            style={{ marginBottom: '1rem', display: 'block' }}
          >
            <option value="">--Choisissez un domaine--</option>
            {getDomaines().map((domaine) => (
              <option key={domaine} value={domaine}>{domaine}</option>
            ))}
          </select>

          {/* SOUS-DOMAINE */}
          {sousDomaines.length > 0 && (
            <>
              <label htmlFor="sousDomaine">Sous-domaine :</label>
              <select
                id="sousDomaine"
                name="sousDomaine"
                onChange={handleSousDomaineChange}
                value={selectedSousDomaine}
                style={{ marginBottom: '1rem', display: 'block' }}
              >
                <option value="">--Choisissez un sous-domaine--</option>
                {sousDomaines.map((sd) => (
                  <option key={sd} value={sd}>{sd}</option>
                ))}
              </select>
            </>
          )}

          {/* ITEM */}
          {items.length > 0 && (
            <>
              <label htmlFor="item">Item :</label>
              <select
                id="item"
                name="item"
                onChange={handleItemChange}
                value={selectedItem}
                style={{ marginBottom: '1rem', display: 'block' }}
              >
                <option value="">--Choisissez un item--</option>
                {items.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </>
          )}

          {/* COMPÉTENCES */}
          {filteredCompetences.length > 0 && (
            <>
              <label>Compétences :</label>
              <ul style={{ marginBottom: '1rem' }}>
                {filteredCompetences.map((c, index) => (
                  <li
                    key={index}
                    onClick={() => handleCompetenceClick(c['Compétence'])}
                    style={{
                      cursor: 'pointer',
                      padding: '0.3rem',
                      backgroundColor: selectedCompetence === c['Compétence'] ? '#F4D35E' : 'transparent'
                    }}
                  >
                    {c['Compétence']}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* APERCU COMPÉTENCE */}
          {selectedCompetence && (
            <div style={{
              border: '1px solid #F4D35E',
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: '#fff8e1',
              marginBottom: '1rem'
            }}>
              <strong>Compétence à travailler :</strong>
              <p>{selectedCompetence}</p>
            </div>
          )}

          {/* TITRE */}
          <label htmlFor="titre">Titre de la séance :</label>
          <input
            type="text"
            id="titre"
            name="titre"
            placeholder="Ex: Les nombres de 1 à 10"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={{ marginBottom: '1rem', display: 'block', width: '100%', padding: '0.5rem' }}
          />

          <button type="submit" className="button">
            Valider
          </button>
        </form>
      </div>
    </>
  );
}
