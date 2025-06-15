import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

export default function Formulaire() {
  const [competences, setCompetences] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState('1');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [sousDomaines, setSousDomaines] = useState([]);
  const [selectedSousDomaine, setSelectedSousDomaine] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [filteredCompetences, setFilteredCompetences] = useState([]);
  const [selectedCompetence, setSelectedCompetence] = useState('');
  const [titre, setTitre] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetch('/data/competences.json')
      .then((res) => res.json())
      .then((data) => setCompetences(data))
      .catch((error) => console.error('Erreur chargement JSON:', error));
  }, []);

  const getDomaines = () => {
    const filtered = competences.filter(item => item.Cycle === `Cycle ${selectedCycle}`);
    return [...new Set(filtered.map(item => item.Domaine))];
  };

  const handleCycleChange = (e) => {
    const cycle = e.target.value;
    setSelectedCycle(cycle);
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
      item => item.Cycle === `Cycle ${selectedCycle}` && item.Domaine === domaine
    );
    const uniqueSousDomaines = [...new Set(filtered.map(item => item['Sous-domaine']))];
    setSousDomaines(uniqueSousDomaines);

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
        item.Domaine === selectedDomaine &&
        item['Sous-domaine'] === sousDomaine
    );
    const uniqueItems = [...new Set(filtered.map(item => item.Item))];
    setItems(uniqueItems);

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

    // Redirection vers la page sequence avec les données
    router.push({
      pathname: '/sequence',
      query: {
        competence: selectedCompetence,
        titre: titre,
        domaine: selectedDomaine,
        sousDomaine: selectedSousDomaine
      }
    });
  };

  return (
    <>
    <Header/>
    <div className="container">
      <h1>
        Créer une <span className="accent">séquence</span>
      </h1>

      <form onSubmit={handleSubmit}>
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

        <label htmlFor="domaine">Domaine :</label>
        <select
          id="domaine"
          name="domaine"
          onChange={handleDomaineChange}
          value={selectedDomaine}
          style={{ marginBottom: '1rem', display: 'block' }}
        >
          <option value="">--Choisissez un domaine--</option>
          {getDomaines().map((domaine) => (
            <option key={domaine} value={domaine}>{domaine}</option>
          ))}
        </select>

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

        {filteredCompetences.length > 0 && (
          <>
            <label>Compétences :</label>
            <ul style={{ marginBottom: '1rem' }}>
              {filteredCompetences.map((c, index) => (
                <li
                  key={index}
                  onClick={() => handleCompetenceClick(c.Compétence)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.3rem',
                    backgroundColor: selectedCompetence === c.Compétence ? '#F4D35E' : 'transparent'
                  }}
                >
                  {c.Compétence}
                </li>
              ))}
            </ul>
          </>
        )}

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
