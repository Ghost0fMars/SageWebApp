import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Link from 'next/link';
import Header from '../components/Header';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Sequence() {
  const router = useRouter();
  const { competence, titre } = router.query;
  const [sequence, setSequence] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanText = (text) => {
    let cleaned = text.replace(/[#*]/g, '');
    cleaned = cleaned.replace(/(Objectif d'apprentissage :)/gi, '<strong>$1</strong>');
    cleaned = cleaned.replace(/(Séquence en 5 séances :)/gi, '<strong>$1</strong>');
    cleaned = cleaned.replace(/(\d+\. (Découverte|Apprentissage|Entra[îi]nement|Synthèse|Évaluation) :) /gi, '<strong>$1</strong> ');
    cleaned = cleaned.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
    return cleaned;
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/genere-sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ competence }),
    });
    const data = await res.json();
    const cleaned = cleanText(data.resultat);
    setSequence(cleaned);
    setLoading(false);
  };

  const handleExportWord = async () => {
    const parser = new DOMParser();
    const docHTML = parser.parseFromString(sequence, 'text/html');
    const paragraphs = docHTML.body.querySelectorAll('p');

    const docParagraphs = Array.from(paragraphs).map(p => {
      const isBold = p.querySelector('strong') !== null;
      const textContent = p.textContent.trim();
      return new Paragraph({
        children: [
          new TextRun({ text: textContent, bold: isBold, size: 24 }),
        ],
      });
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: "Nouvelle Séquence", bold: true, size: 28 })],
            }),
            new Paragraph(""),
            ...docParagraphs,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "sequence.docx");
  };

  // Fonction d'extraction des tuiles avec nom, objectif et consigne
  const extractTuilesFromSequence = (sequenceHtml) => {
  const parser = new DOMParser();
  const docHTML = parser.parseFromString(sequenceHtml, 'text/html');
  const text = docHTML.body.textContent;

  // Découpe par "Séance X -" ou "Séance X –" ou "Séance X:"
  const blocks = text.split(/Séance\s*\d+\s*[-–:]\s*/i).filter(Boolean);

  const tuiles = blocks.map(block => {
    // Cherche le titre
    const titreMatch = block.match(/Titre\s*:\s*(.*)/i);
    // Cherche la consigne
    const consigneMatch = block.match(/Consigne pour les élèves\s*:\s*(.*)/i);
    // Cherche l'objectif (si présent)
    const objectifMatch = block.match(/Objectif\s*:\s*(.*)/i);

    return {
      nom: titreMatch ? titreMatch[1].trim() : "Sans titre",
      objectif: objectifMatch ? objectifMatch[1].trim() : "",
      consigne: consigneMatch ? consigneMatch[1].trim() : "",
    };
  });

  return tuiles;
};

  const handleExporterTuiles = async () => {
    const tuiles = extractTuilesFromSequence(sequence);
    console.log("Tuiles extraites :", tuiles);
    
    await Promise.all(
      tuiles.map(tuile =>
        fetch('/api/seance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titre: tuile.nom,
            objectif: tuile.objectif,
            consigne: tuile.consigne,
            domaine: "À renseigner",
            couleur: "#F4D35E",
            userId: "demo-user",
            position: "sidebar",
          }),
        })
      )
    );

    alert("Tuiles exportées avec succès vers l'interface principale.");
    window.dispatchEvent(new Event("refresh-seances"));
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Nouvelle <span className="accent">séquence</span></h1>
        <p><strong>Titre de la séquence :</strong> {titre}</p>
        <p><strong>Compétence à travailler :</strong> {competence}</p>

        <button className="button" onClick={handleGenerate}>
          Générer séquence
        </button>

        {loading && (
          <div style={{ marginTop: '1rem' }}>
            <p>⏳ L'IA génère la séquence, merci de patienter…</p>
          </div>
        )}

        {sequence && (
          <div style={{ marginTop: '1rem' }}>
            <h2>Votre séquence :</h2>
            <ReactQuill
              theme="snow"
              value={sequence}
              onChange={setSequence}
              style={{ height: '400px', overflowY: 'auto', marginBottom: '1rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', gap: '1rem' }}>
              <button className="button" onClick={handleExportWord}>
                Exporter en Word
              </button>

              <button className="button" onClick={handleExporterTuiles}>
                Exporter les tuiles
              </button>

              <Link
                href={{ pathname: '/seances', query: { sequence } }}
                legacyBehavior
              >
                <button className="button" style={{ display: 'inline-block' }}>
                  Suivant
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}