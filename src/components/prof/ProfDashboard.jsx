import { useState } from 'react'
import ProfNavbar from './ProfNavbar'
import EtudiantList from '../EtudiantList'
import EtudiantFiche from '../EtudiantFiche'
import NoteForm from '../NoteForm'

function ProfDashboard({ prof, classes, etudiants, notes, onAjouterNote, onSupprimerNote, onDeconnecter }) {
  const [page, setPage] = useState('classes')
  const [classeActive, setClasseActive] = useState(null)
  const [etudiantActif, setEtudiantActif] = useState(null)

  // Filtre uniquement les classes du prof
  const classesDuProf = classes.filter(c => prof.classesGerees?.includes(c.id))

  function ouvrirClasse(classe) {
    setClasseActive(classe)
    setPage('etudiants')
  }

  function ouvrirFiche(etudiant) {
    setEtudiantActif(etudiant)
    setPage('fiche')
  }

  function retour() {
    if (page === 'etudiants') setPage('classes')
    else if (page === 'fiche' || page === 'ajoutNote') setPage('etudiants')
  }

  async function handleAjouterNote(note) {
    await onAjouterNote({ ...note, matiere: prof.matiere }, etudiantActif.id)
    setPage('fiche')
  }

  function renderPage() {
    switch (page) {
      case 'classes':
        return (
          <div style={styles.container}>
            <div style={styles.header}>
              <div>
                <h2 style={styles.titre}>Mes Classes</h2>
                <p style={styles.sous}>
                  {classesDuProf.length} classe{classesDuProf.length !== 1 ? 's' : ''} assignée{classesDuProf.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {classesDuProf.length === 0 ? (
              <div style={styles.vide}>
                <div style={styles.videIcone}>📭</div>
                <h3 style={styles.videTitle}>Aucune classe assignée</h3>
                <p style={styles.videText}>Contacte l'administrateur pour être assigné à des classes.</p>
              </div>
            ) : (
              <div style={styles.grille}>
                {classesDuProf.map(classe => {
                  const nbEtudiants = etudiants.filter(e => e.classeId === classe.id).length
                  return (
                    <div key={classe.id} style={styles.card} onClick={() => ouvrirClasse(classe)}>
                      <div style={styles.cardIcone}>🏫</div>
                      <h3 style={styles.cardNom}>{classe.nom}</h3>
                      <p style={styles.cardNb}>👥 {nbEtudiants} étudiant{nbEtudiants !== 1 ? 's' : ''}</p>
                      <div style={styles.cardMatiere}>{prof.matiere}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 'etudiants':
        return (
          <EtudiantList
            classe={classeActive}
            etudiants={etudiants.filter(e => e.classeId === classeActive?.id)}
            onOuvrir={ouvrirFiche}
            onSupprimer={() => {}}
            onAjouter={() => {}}
            onModifier={() => {}}
            modeProf={true}
          />
        )

      case 'fiche':
        return (
          <EtudiantFiche
            etudiant={etudiantActif}
            notes={notes.filter(n => n.etudiantId === etudiantActif?.id && n.matiere === prof.matiere)}
            onSupprimerNote={onSupprimerNote}
            onAjouterNote={() => setPage('ajoutNote')}
          />
        )

      case 'ajoutNote':
        return <NoteForm onSauvegarder={handleAjouterNote} matiereFixe={prof.matiere} professeurFixe={`${prof.prenom} ${prof.nom}`} />

      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f4ff' }}>
      <ProfNavbar prof={prof} onDeconnecter={onDeconnecter} />
      <div style={styles.contenu}>
        {page !== 'classes' && (
          <button style={styles.btnRetour} onClick={retour}>← Retour</button>
        )}
        {renderPage()}
      </div>
    </div>
  )
}

const styles = {
  contenu: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  btnRetour: {
    backgroundColor: 'white',
    border: '2px solid #e8e5ff',
    color: '#5b4fff',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    marginBottom: '1.5rem',
    fontFamily: "'Outfit', sans-serif",
  },
  container: { padding: '0.5rem 0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  titre: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1a1535',
    letterSpacing: '-0.5px',
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.9rem',
    marginTop: '2px',
  },
  grille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.8rem',
    boxShadow: '0 2px 8px rgba(91,79,255,0.08)',
    border: '1px solid #e8e5ff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardIcone: { fontSize: '2.5rem', marginBottom: '0.8rem' },
  cardNom: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1a1535',
    marginBottom: '0.4rem',
    fontFamily: "'Outfit', sans-serif",
  },
  cardNb: {
    color: '#8b87a8',
    fontSize: '0.85rem',
    marginBottom: '0.8rem',
  },
  cardMatiere: {
    display: 'inline-block',
    backgroundColor: '#ede9ff',
    color: '#5b4fff',
    padding: '0.3rem 0.8rem',
    borderRadius: '99px',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  vide: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '2px dashed #e8e5ff',
  },
  videIcone: { fontSize: '3.5rem', marginBottom: '1rem' },
  videTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#1a1535',
    marginBottom: '0.5rem',
  },
  videText: { color: '#8b87a8' },
}

export default ProfDashboard