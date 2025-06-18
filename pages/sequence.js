import { useRouter } from 'next/router';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Header from '../components/Header';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function Sequence() {
  const router = useRouter();
  const { competence, titre, domaine, sousDomaine } = router.query;

  const [sequence, setSequence] = useState('');
  const [rawProgression, setRawProgression] = useState('');
  const [generating, setGenerating] = useState(false); // ✅ renommé pour cohérence
  const [nextLoading, setNextLoading] = useState(false);

  const cleanText = (text) => {
    let cleaned = text.replace(/[#*]/g, '');
    cleaned = cleaned.replace(/(Objectif d'apprentissage :)/gi, '<strong>$1</strong>');
    cleaned = cleaned.replace(/(Séquence en 5 séances :)/gi, '<strong>$1</strong>');
    cleaned = cleaned.replace(/(\d+\. (Titre|Découverte|Apprentissage|Entra[îi]nement|Synthèse|Évaluation) :) /gi, '<strong>$1</strong> ');
    cleaned = cleaned.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
    return cleaned;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/genere-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          competence, 
          titre, 
          domaine, 
          sousDomaine,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la génération");

      const data = await res.json();
      setRawProgression(data.resultat);
      const cleaned = cleanText(data.resultat);
      setSequence(cleaned);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur de génération");
    } finally {
      setGenerating(false);
    }
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

  const handleNext = async () => {
    setNextLoading(true);
    try {
      const res = await fetch('/api/sequences/create-or-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titre,
          domaine,
          sousDomaine,
          competence,
          progression: sequence,
        }),
      });

      const data = await res.json();
      const sequenceId = data.sequenceId;

      const blocs = rawProgression.split(/\n\d+\. Titre/).filter(Boolean).slice(1);
      console.log("Découpage blocs :", blocs);

      if (blocs.length < 5) {
        alert("Problème : progression incomplète, moins de 5 blocs !");
        return;
      }

      await Promise.all(
        blocs.map((bloc, i) =>
          fetch('/api/seances', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sequenceId,
              title: `Séance ${i + 1}`,
              objectif: bloc.trim(),
            }),
          })
        )
      );

      router.push(`/seances?sequenceId=${sequenceId}`);

    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la sauvegarde ou création des séances");
    } finally {
      setNextLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Nouvelle <span className="accent">séquence</span></h1>
        <p><strong>Titre de la séquence :</strong> {titre}</p>
        <p><strong>Compétence à travailler :</strong> {competence}</p>

        <button
          className="button"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? "Génération en cours..." : "Générer séquence"}
        </button>

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

              <button
                className="button"
                onClick={handleNext}
                disabled={nextLoading}
              >
                {nextLoading ? "Création en cours..." : "Suivant"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
