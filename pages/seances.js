import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Header from '@/components/Header';

// ReactQuill dynamique (éviter les erreurs SSR)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Seances() {
  const router = useRouter();
  const { sequence, titre, competence, domaine, sousDomaine } = router.query; // ✅ récupère tout proprement

  const [detailedSessions, setDetailedSessions] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanDetailedSessions = (text) => {
    let cleaned = text;
    cleaned = cleaned.replace(/[#*]/g, '');
    cleaned = cleaned.replace(/(\d+)\. (Séance [^:]+:)/g, '<strong>$1. $2</strong>');
    cleaned = cleaned.replace(/Phase d'introduction/g, '<br><u>Phase d\'introduction</u>');
    cleaned = cleaned.replace(/Phase de recherche/g, '<br><u>Phase de recherche</u>');
    cleaned = cleaned.replace(/Phase de mise en commun/g, '<br><u>Phase de mise en commun</u>');
    cleaned = cleaned.replace(/Phase de synthèse et institutionnalisation/g, '<br><u>Phase de synthèse et institutionnalisation</u>');
    cleaned = cleaned.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
    return cleaned;
  };

  const handleGenerateDetailed = async () => {
    setLoading(true);
    const res = await fetch('/api/genere-seances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence, domaine, sousDomaine }), // ✅ passe le bon nom
    });
    const data = await res.json();
    const cleaned = cleanDetailedSessions(data.resultat);
    setDetailedSessions(cleaned);
    setLoading(false);
  };

  const handleExportWord = async () => {
    const tmp = document.createElement('div');
    tmp.innerHTML = detailedSessions;

    const paragraphs = [];
    tmp.childNodes.forEach(node => {
      if (node.nodeName === 'P') {
        const text = node.textContent.trim();
        if (text) paragraphs.push(new Paragraph(text));
      } else if (node.nodeName === 'STRONG') {
        const text = node.textContent.trim();
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text, bold: true })],
          spacing: { after: 200 },
        }));
      } else if (node.nodeName === 'U') {
        const text = node.textContent.trim();
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text, underline: {} })],
          spacing: { after: 100 },
        }));
      }
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Séances détaillées', bold: true, size: 28 })],
            }),
            new Paragraph(''),
            ...paragraphs,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'seances_detaillees.docx');
  };

  const handleSaveSequence = async () => {
    if (!titre || !competence) {
      alert("Titre ou compétence manquant !");
      return;
    }

    // ✅ Ajout du log pour vérif
    console.log("🔍 Sauvegarde séquence avec :", {
      title: titre,
      domaine: domaine,
      sousDomaine: sousDomaine,
      competence: competence,
      seancesDetaillees: detailedSessions,
    });

    const res = await fetch("/api/sequences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titre,
        content: {
          domaine: domaine,
          sousDomaine: sousDomaine,
          competence: competence,
          seancesDetaillees: detailedSessions,
        },
      }),
    });

    if (res.ok) {
      alert("Séquence sauvegardée avec succès !");
    } else {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Séances <span className="accent">détaillées</span></h1>

        <button className="button" onClick={handleGenerateDetailed}>
          Générer séances
        </button>

        {loading && (
          <div style={{ marginTop: '1rem' }}>
            <p>⏳ L'IA génère les séances détaillées, merci de patienter…</p>
          </div>
        )}

        {detailedSessions && (
          <div style={{ marginTop: '1rem' }}>
            <h2>Modifier les séances :</h2>
            <ReactQuill
              theme="snow"
              value={detailedSessions}
              onChange={setDetailedSessions}
              style={{
                height: '400px',
                overflowY: 'auto',
                marginBottom: '1rem'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button className="button" onClick={handleExportWord}>
                Exporter en Word
              </button>
              <button className="button" onClick={handleSaveSequence}>
                Sauvegarder la séquence et séances
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
