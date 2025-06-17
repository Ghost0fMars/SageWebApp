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
              
              <Link
                href={{
                  pathname: '/seances',
                  query: {
                    sequence: sequence,
                    titre: titre,
                    competence: competence,
                    domaine: router.query.domaine,
                    sousDomaine: router.query.sousDomaine
                  }
                }}
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
