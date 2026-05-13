import { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminProfs from './AdminProfs'
import ClasseList from '../ClasseList'
import ClasseForm from '../ClasseForm'
import EtudiantList from '../EtudiantList'
import EtudiantForm from '../EtudiantForm'
import EtudiantFiche from '../EtudiantFiche'
import NoteForm from '../NoteForm'

function AdminDashboard({
  classes, etudiants, notes, profs,
  onAjouterClasse, onSupprimerClasse, onModifierClasse,
  onAjouterEtudiant, onSupprimerEtudiant, onModifierEtudiant,
  onAjouterNote, onSupprimerNote,
  onDeconnecter
}) {
  const [section, setSection] = useState('classes')
  const [page, setPage] = useState('liste')
  const [classeActive, setClasseActive] = useState(null)
  const [etudiantActif, setEtudiantActif] = useState(null)

  const profsEnLigne = profs.filter(p => p.enligne).length

  function ouvrirClasse(classe) {
    setClasseActive(classe)
    setPage('etudiants')
  }

  function ouvrirFiche(etudiant) {
    setEtudiantActif(etudiant)
    setPage('fiche')
  }

  function retour() {
    if (page === 'etudiants' || page === 'ajoutEtudiant') setPage('liste')
    else if (page === 'fiche' || page === 'ajoutNote') setPage('etudiants')
    else if (page === 'ajoutClasse') setPage('liste')
    else setPage('liste')
  }

  async function handleAjouterEtudiant(nom) {
    await onAjouterEtudiant(nom, classeActive.id)
    setPage('etudiants')
  }

  async function handleAjouterNote(note) {
    await onAjouterNote(note, etudiantActif.id)
    setPage('fiche')
  }

  function renderContenu() {
    if (section === 'profs') {
      return <AdminProfs classes={classes} />
    }

    switch (page) {
      case 'liste':
        return (
          <ClasseList
            classes={classes}
            etudiants={etudiants}
            onOuvrir={ouvrirClasse}
            onSupprimer={onSupprimerClasse}
            onAjouter={() => setPage('ajoutClasse')}
            onModifier={onModifierClasse}
          />
        )
      case 'ajoutClasse':
        return <ClasseForm onSauvegarder={async (nom) => { await onAjouterClasse(nom); setPage('liste') }} />
      case 'etudiants':
        return (
          <EtudiantList
            classe={classeActive}
            etudiants={etudiants.filter(e => e.classeId === classeActive?.id)}
            onOuvrir={ouvrirFiche}
            onSupprimer={onSupprimerEtudiant}
            onAjouter={() => setPage('ajoutEtudiant')}
            onModifier={onModifierEtudiant}
          />
        )
      case 'ajoutEtudiant':
        return <EtudiantForm classe={classeActive} onSauvegarder={handleAjouterEtudiant} />
      case 'fiche':
        return (
          <EtudiantFiche
            etudiant={etudiantActif}
            notes={notes.filter(n => n.etudiantId === etudiantActif?.id)}
            onSupprimerNote={onSupprimerNote}
            onAjouterNote={() => setPage('ajoutNote')}
          />
        )
      case 'ajoutNote':
        return <NoteForm onSauvegarder={handleAjouterNote} />
      default:
        return null
    }
  }

  const afficherRetour = page !== 'liste' && section !== 'profs'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f4ff' }}>
      <AdminNavbar
        page={section}
        onPage={(s) => { setSection(s); setPage('liste') }}
        onDeconnecter={onDeconnecter}
        profsEnLigne={profsEnLigne}
      />

      <div style={styles.contenu}>
        {afficherRetour && (
          <button style={styles.btnRetour} onClick={retour}>
            ← Retour
          </button>
        )}
        {renderContenu()}
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
}

export default AdminDashboard