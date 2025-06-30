import React, { useState, useEffect } from 'react';
import {
  User, Phone, FileText, BookOpen, AlertCircle, Plus, Edit2, Eye, Trash2,
  CheckCircle, XCircle, Award, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import Header from '@/components/Header';
import { useSession } from "next-auth/react";


export default function Classe() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('effectifs');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [students, setStudents] = useState([]);  
  const [newStudent, setNewStudent] = useState({
    prenom: '', nom: '', dateNaissance: '', parentNom: '', parentTel: '', parentEmail: '',
    documents: { assurance: false, droitImage: false, cantine: false },
    besoinsParticuliers: [], notes: '',
    evaluations: {
      francais: { note: '', progression: 'stable' },
      mathematiques: { note: '', progression: 'stable' },
      sciences: { note: '', progression: 'stable' }
    }
  });

 useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/eleves?userId=${session.user.id}`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setStudents([]));
  }, [session]);

   const handleAddStudent = async () => {
    if (newStudent.prenom && newStudent.nom && session?.user?.id) {
      const toSave = {
        ...newStudent,
        userId: session.user.id,
        evaluations: {
          francais: { note: newStudent.evaluations.francais.note || 0, progression: 'stable' },
          mathematiques: { note: newStudent.evaluations.mathematiques.note || 0, progression: 'stable' },
          sciences: { note: newStudent.evaluations.sciences.note || 0, progression: 'stable' }
        }
      };
      const res = await fetch('/api/eleves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave)
      });
      const saved = await res.json();
      setNewStudent({
        prenom: '', nom: '', dateNaissance: '', parentNom: '', parentTel: '', parentEmail: '',
        documents: { assurance: false, droitImage: false, cantine: false },
        besoinsParticuliers: [], notes: '',
        evaluations: {
          francais: { note: '', progression: 'stable' },
          mathematiques: { note: '', progression: 'stable' },
          sciences: { note: '', progression: 'stable' }
        }
      });
      setShowForm(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    await fetch(`/api/eleves/${id}`, { method: 'DELETE' });
    setStudents(students.filter(s => s.id !== id));
    if (selectedStudent && selectedStudent.id === id) setSelectedStudent(null);
  };

  const updateSelectedStudent = (field, value) => {
    setSelectedStudent(prev => ({ ...prev, [field]: value }));
  };

  const saveEditedStudent = () => {
    setStudents(students.map(s => s.id === selectedStudent.id ? selectedStudent : s));
    setSelectedStudent(null);
  };


  const updateStudentEvaluation = (studentId, matiere, note, progression) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? {
          ...student,
          evaluations: {
            ...student.evaluations,
            [matiere]: { note: parseInt(note) || 0, progression }
          }
        }
        : student
    ));
  };

  const toggleDocument = (studentId, docType) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? {
          ...student,
          documents: {
            ...student.documents,
            [docType]: !student.documents[docType]
          }
        }
        : student
    ));
  };

  const addBesoinParticulier = (studentId, besoin) => {
    if (besoin.trim()) {
      setStudents(students.map(student =>
        student.id === studentId
          ? {
            ...student,
            besoinsParticuliers: [...student.besoinsParticuliers, besoin.trim()]
          }
          : student
      ));
    }
  };

  const removeBesoinParticulier = (studentId, index) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? {
          ...student,
          besoinsParticuliers: student.besoinsParticuliers.filter((_, i) => i !== index)
        }
        : student
    ));
  };

  const updateNotes = (studentId, notes) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, notes } : student
    ));
  };

  const getProgressionIcon = (progression) => {
    switch (progression) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProgressionColor = (progression) => {
    switch (progression) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const documentsManquants = students.reduce((acc, student) => {
    const manquants = Object.entries(student.documents).filter(([_, value]) => !value);
    return acc + manquants.length;
  }, 0);

  const elevesBesoinsParticuliers = students.filter(s => s.besoinsParticuliers.length > 0).length;

  return (
    <>
      <Header />
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1>Ma classe <span className="accent">({students.length} élèves)</span></h1>
          <button 
            onClick={() => setShowForm(true)}
            className="button"
          >
            <Plus size={16} />
            Ajouter un élève
          </button>
        </div>

        {/* Statistiques rapides */}
        <div className="stats-container">
          <div className="tile-stat">
            <div className="flex items-center justify-center gap-2">
              <FileText size={20} className="text-blue-600" />
              <div>
                <div className="font-bold">{documentsManquants}</div>
                <div className="text-sm">Documents manquants</div>
              </div>
            </div>
          </div>
          <div className="tile-stat">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle size={20} className="text-orange-600" />
              <div>
                <div className="font-bold">{elevesBesoinsParticuliers}</div>
                <div className="text-sm">Besoins particuliers</div>
              </div>
            </div>
          </div>
          <div className="tile-stat">
            <div className="flex items-center justify-center gap-2">
              <Award size={20} className="text-green-600" />
              <div>
                <div className="font-bold">{Math.round(students.reduce((acc, s) => acc + (s.evaluations.francais.note + s.evaluations.mathematiques.note + s.evaluations.sciences.note)/3, 0) / students.length) || 0}</div>
                <div className="text-sm">Moyenne générale</div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="onglet-classe">
          {[
            { id: 'effectifs', label: 'Effectifs', icon: User },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'evaluations', label: 'Évaluations', icon: BookOpen },
            { id: 'suivi', label: 'Suivi individuel', icon: Eye }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className= {`bouton-onglet ${
                activeTab === tab.id 
                  ? 'border-yellow-400 text-black font-semibold' 
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'effectifs' && (
          <div className="tuiles-eleves">

        {students.map(student => (
          <div
        key={student.id}
        className="tile-seance cursor-pointer hover:shadow-md transition"
        onClick={() => {
  setSelectedStudent(student);
  setEditMode(false);
}}

      >
          {/* Tuile élève */}

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center font-bold text-xs">
              {student.prenom.charAt(0)}{student.nom.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base">{student.prenom} {student.nom}</h3>
              <p className="text-xs text-gray-600">Né(e) le {new Date(student.dateNaissance).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="mt-2 text-xs">
            <strong>Contact :</strong> {student.parentNom}<br />
            📞 {student.parentTel}
          </div>
        </div>
        <div className="flex gap-1">
          <button
  onClick={(e) => {
    e.stopPropagation(); // pour éviter de déclencher le onClick sur la tuile
    setSelectedStudent(student);
    setEditMode(true);
  }}
  className="tile-button"
>
  <Edit2 size={14} />
</button>


          <button onClick={() => handleDeleteStudent(student.id)} className="tile-button hover:bg-red-200">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>

        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="tile-student">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">{student.prenom} {student.nom}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(student.documents).map(([doc, status]) => (
                    <div key={doc} className="flex items-center justify-between p-2 rounded">
                      <span className="capitalize">{doc === 'droitImage' ? 'Droit à l\'image' : doc}</span>
                      <button
                        onClick={() => toggleDocument(student.id, doc)}
                        className={`tile-button ${status ? 'bg-green-200' : 'bg-red-200'}`}
                      >
                        {status ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="tile-student">
                <h3 className="font-bold mb-3">{student.prenom} {student.nom}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(student.evaluations).map(([matiere, data]) => (
                    <div key={matiere} className="rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold capitalize">{matiere}</span>
                        <div className="flex items-center gap-1">
                          {getProgressionIcon(data.progression)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={data.note}
                          onChange={(e) => updateStudentEvaluation(student.id, matiere, e.target.value, data.progression)}
                          className="w-16 p-1 border rounded text-center"
                        />
                        <span>/20</span>
                        <select
                          value={data.progression}
                          onChange={(e) => updateStudentEvaluation(student.id, matiere, data.note, e.target.value)}
                          className="p-1 border rounded text-sm"
                        >
                          <option value="positive">↗ Progrès</option>
                          <option value="stable">→ Stable</option>
                          <option value="negative">↘ Difficultés</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suivi' && (
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="tile-student">
                <h3 className="font-bold mb-3">{student.prenom} {student.nom}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Besoins particuliers
                    </h4>
                    <div className="space-y-2">
                      {student.besoinsParticuliers.map((besoin, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm">{besoin}</span>
                          <button
                            onClick={() => removeBesoinParticulier(student.id, index)}
                            className="tile-button bg-red-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ajouter un besoin..."
                          className="flex-1 p-2 border rounded text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addBesoinParticulier(student.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Edit2 size={16} />
                      Notes sur l'élève
                    </h4>
                    <textarea
                      value={student.notes}
                      onChange={(e) => updateNotes(student.id, e.target.value)}
                      placeholder="Notes sur l'élève..."
                      className="w-full p-2 border rounded text-sm h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire d'ajout d'élève */}
        {showForm && (
          <div className="form-overlay">
            <div className="form-container">
              <h2 className="text-xl font-bold mb-4">Ajouter un nouvel élève</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={newStudent.prenom}
                    onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nom *</label>
                  <input
                    type="text"
                    value={newStudent.nom}
                    onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={newStudent.dateNaissance}
                    onChange={(e) => setNewStudent({...newStudent, dateNaissance: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nom du parent</label>
                  <input
                    type="text"
                    value={newStudent.parentNom}
                    onChange={(e) => setNewStudent({...newStudent, parentNom: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newStudent.parentTel}
                    onChange={(e) => setNewStudent({...newStudent, parentTel: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudent.parentEmail}
                    onChange={(e) => setNewStudent({...newStudent, parentEmail: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddStudent}
                  className="button"
                >
                  Ajouter l'élève
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vue détaillée d'un élève */}
{selectedStudent && (
  <div className="form-overlay">
    <div className="form-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedStudent.prenom} {selectedStudent.nom}
        </h2>
        <button
          onClick={() => setSelectedStudent(null)}
          className="tile-button"
        >
          <XCircle size={16} />
        </button>
      </div>

      {editMode ? (
        <>
          {/* MODE ÉDITION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Prénom', field: 'prenom' },
              { label: 'Nom', field: 'nom' },
              { label: 'Date de naissance', field: 'dateNaissance', type: 'date' },
              { label: 'Nom du parent', field: 'parentNom' },
              { label: 'Téléphone', field: 'parentTel', type: 'tel' },
              { label: 'Email', field: 'parentEmail', type: 'email' }
            ].map(({ label, field, type = 'text' }) => (
              <div key={field}>
                <label className="block text-sm font-semibold mb-1">{label}</label>
                <input
                  type={type}
                  value={selectedStudent[field] || ''}
                  onChange={(e) => updateSelectedStudent(field, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditMode(false)} className="px-4 py-2 border rounded hover:bg-gray-50">
              Annuler
            </button>
            <button onClick={saveEditedStudent} className="button">
              Enregistrer
            </button>
          </div>
        </>
      ) : (
        <>
          {/* MODE LECTURE SEULE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Date de naissance :</strong> {new Date(selectedStudent.dateNaissance).toLocaleDateString('fr-FR')}</p>
                <p><strong>Parent :</strong> {selectedStudent.parentNom}</p>
                <p><strong>Téléphone :</strong> {selectedStudent.parentTel}</p>
                <p><strong>Email :</strong> {selectedStudent.parentEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Documents</h3>
              <div className="space-y-2">
                {Object.entries(selectedStudent.documents).map(([doc, status]) => (
                  <div key={doc} className="flex items-center gap-2">
                    {status ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm capitalize">{doc === 'droitImage' ? 'Droit à l\'image' : doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Évaluations</h3>
              <div className="space-y-2">
                {Object.entries(selectedStudent.evaluations).map(([matiere, data]) => (
                  <div key={matiere} className="flex items-center justify-between p-2 rounded">
                    <span className="capitalize text-sm">{matiere}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{data.note}/20</span>
                      <div className={getProgressionColor(data.progression)}>
                        {getProgressionIcon(data.progression)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Besoins particuliers</h3>
              <div className="space-y-1">
                {selectedStudent.besoinsParticuliers.length > 0 ? (
                  selectedStudent.besoinsParticuliers.map((besoin, index) => (
                    <div key={index} className="p-2 bg-orange-50 rounded text-sm">
                      {besoin}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucun besoin particulier</p>
                )}
              </div>
            </div>
          </div>

          {selectedStudent.notes && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Notes sur l'élève</h3>
              <div className="p-3 bg-gray-50 rounded text-sm">
                {selectedStudent.notes}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}


      </div>
    </>
  );
}
