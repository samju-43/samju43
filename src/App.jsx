import { useState, useEffect } from "react";
import Connexion from './components/auth/Connexion'
import Inscription from './components/auth/Inscription'
import Verification from './components/auth/Verification'
import ClasseList from './components/ClasseList';
import Navbar from './components/Navbar';
import ClasseForm from './components/ClasseForm';
import EtudiantList from './components/EtudiantList';
import EtudiantForm from './components/EtudiantForm';
import EtudiantFiche from './components/EtudiantFiche';
import NoteForm from "./components/NoteForm";
import {
  getClasses, ajouterClasseDB, supprimerClasseDB, modifierClasseDB,
  getEtudiants, ajouterEtudiantDB, supprimerEtudiantDB, modifierEtudiantDB,
  getNotes, ajouterNoteDB, supprimerNoteDB
} from './firebaseService'

function App() {
  const [authPage, setAuthPage] = useState('connexion') // 'connexion' | 'inscription' | 'verification'
  const [profConnecte, setProfConnecte] = useState(() => {
    const saved = localStorage.getItem('profConnecte')
    return saved ? JSON.parse(saved) : null
  })
  const [formInscription, setFormInscription] = useState(null)
  const [codeAttendu, setCodeAttendu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes")
    return saved ? JSON.parse(saved) : []
  })
  const [etudiants, setEtudiants] = useState(() => {
    const saved = localStorage.getItem("etudiants")
    return saved ? JSON.parse(saved) : []
  })
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes")
    return saved ? JSON.parse(saved) : []
  })

  const [page, setPage] = useState('classes')
  const [classeActive, setClasseActive] = useState(null)
  const [etudiantActif, setEtudiantActif] = useState(null)

  // ── Chargement Firebase au démarrage ─────────────
  useEffect(() => {
    async function chargerDonnees() {
      try {
        const [cls, etu, nts] = await Promise.all([
          getClasses(),
          getEtudiants(),
          getNotes()
        ])
        setClasses(cls)
        setEtudiants(etu)
        setNotes(nts)
        // Sauvegarde aussi dans localStorage (backup)
        localStorage.setItem('classes', JSON.stringify(cls))
        localStorage.setItem('etudiants', JSON.stringify(etu))
        localStorage.setItem('notes', JSON.stringify(nts))
      } catch (err) {
        console.error('Erreur Firebase, on utilise localStorage', err)
        // Si Firebase échoue → localStorage prend le relais
      } finally {
        setLoading(false)
      }
    }
    chargerDonnees()
  }, [])

  function onCodeEnvoye(form, code) {
    setFormInscription(form)
    setCodeAttendu(code)
    setAuthPage('verification')
  }

  function onInscriptionReussie(form) {
    const prof = { ...form }
    setProfConnecte(prof)
    localStorage.setItem('profConnecte', JSON.stringify(prof))
  }

  function onConnecte(prof) {
    setProfConnecte(prof)
    localStorage.setItem('profConnecte', JSON.stringify(prof))
  }

  function seDeconnecter() {
    setProfConnecte(null)
    localStorage.removeItem('profConnecte')
  }

  // ── Si pas connecté → affiche auth ───────────────
  if (!profConnecte) {
    if (authPage === 'inscription') {
      return (
        <Inscription
          classes={classes}
          onCodeEnvoye={onCodeEnvoye}
          onConnexion={() => setAuthPage('connexion')}
        />
      )
    }
    if (authPage === 'verification') {
      return (
        <Verification
          form={formInscription}
          codeAttendu={codeAttendu}
          onSuccess={onInscriptionReussie}
          onRetour={() => setAuthPage('inscription')}
        />
      )
    }
    return (
      <Connexion
        onConnecte={onConnecte}
        onInscription={() => setAuthPage('inscription')}
      />
    )
  }

  // ── Si connecté → filtre les classes du prof ──────
  const classesDuProf = classes.filter(c =>
    profConnecte.classesGerees?.includes(c.id)
  )

  // ── Fonctions Classes ─────────────────────────────
  async function ajouterClasse(nom) {
    try {
      const id = await ajouterClasseDB(nom)
      const nouvelle = { id, nom }
      setClasses(prev => {
        const updated = [...prev, nouvelle]
        localStorage.setItem('classes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur ajout classe:', err)
    }
    setPage('classes')
  }

  async function supprimerClasse(id) {
    if (!window.confirm('Supprimer cette classe et tous ses étudiants ?')) return
    try {
      const etudiantsIds = etudiants.filter(e => e.classeId === id).map(e => e.id)
      await supprimerClasseDB(id)
      for (const eid of etudiantsIds) {
        await supprimerEtudiantDB(eid)
        const notesEtu = notes.filter(n => n.etudiantId === eid)
        for (const n of notesEtu) await supprimerNoteDB(n.id)
      }
      setClasses(prev => {
        const updated = prev.filter(c => c.id !== id)
        localStorage.setItem('classes', JSON.stringify(updated))
        return updated
      })
      setEtudiants(prev => {
        const updated = prev.filter(e => e.classeId !== id)
        localStorage.setItem('etudiants', JSON.stringify(updated))
        return updated
      })
      setNotes(prev => {
        const updated = prev.filter(n => !etudiantsIds.includes(n.etudiantId))
        localStorage.setItem('notes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur suppression classe:', err)
    }
    setPage('classes')
  }

  async function modifierClasse(id, nouveauNom) {
    try {
      await modifierClasseDB(id, nouveauNom)
      setClasses(prev => {
        const updated = prev.map(c => c.id === id ? { ...c, nom: nouveauNom } : c)
        localStorage.setItem('classes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur modification classe:', err)
    }
  }

  // ── Fonctions Étudiants ───────────────────────────
  async function ajouterEtudiant(nom) {
    try {
      const id = await ajouterEtudiantDB(nom, classeActive.id)
      const nouveau = { id, nom, classeId: classeActive.id }
      setEtudiants(prev => {
        const updated = [...prev, nouveau]
        localStorage.setItem('etudiants', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur ajout étudiant:', err)
    }
    setPage('etudiants')
  }

  async function supprimerEtudiant(id) {
    if (!window.confirm('Supprimer cet étudiant et toutes ses notes ?')) return
    try {
      await supprimerEtudiantDB(id)
      const notesEtu = notes.filter(n => n.etudiantId === id)
      for (const n of notesEtu) await supprimerNoteDB(n.id)
      setEtudiants(prev => {
        const updated = prev.filter(e => e.id !== id)
        localStorage.setItem('etudiants', JSON.stringify(updated))
        return updated
      })
      setNotes(prev => {
        const updated = prev.filter(n => n.etudiantId !== id)
        localStorage.setItem('notes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur suppression étudiant:', err)
    }
    setPage('etudiants')
  }

  async function modifierEtudiant(id, nouveauNom) {
    try {
      await modifierEtudiantDB(id, nouveauNom)
      setEtudiants(prev => {
        const updated = prev.map(e => e.id === id ? { ...e, nom: nouveauNom } : e)
        localStorage.setItem('etudiants', JSON.stringify(updated))
        return updated
      })
      if (etudiantActif?.id === id) setEtudiantActif(prev => ({ ...prev, nom: nouveauNom }))
    } catch (err) {
      console.error('Erreur modification étudiant:', err)
    }
  }

  // ── Fonctions Notes ───────────────────────────────
  async function ajouterNote(note) {
    try {
      const noteComplete = {
        ...note,
        etudiantId: etudiantActif.id,
        date: new Date().toLocaleDateString('fr-FR')
      }
      const id = await ajouterNoteDB(noteComplete)
      const nouvelle = { ...noteComplete, id }
      setNotes(prev => {
        const updated = [...prev, nouvelle]
        localStorage.setItem('notes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur ajout note:', err)
    }
    setPage('fiche')
  }

  async function supprimerNote(id) {
    if (!window.confirm('Supprimer cette note ?')) return
    try {
      await supprimerNoteDB(id)
      setNotes(prev => {
        const updated = prev.filter(n => n.id !== id)
        localStorage.setItem('notes', JSON.stringify(updated))
        return updated
      })
    } catch (err) {
      console.error('Erreur suppression note:', err)
    }
  }

  // ── Navigation ────────────────────────────────────
  function ouvrirClasse(classe) {
    setClasseActive(classe)
    setPage('etudiants')
  }

  function ouvrirFiche(etudiant) {
    setEtudiantActif(etudiant)
    setPage('fiche')
  }

  function retour() {
    if (page === 'etudiants' || page === 'ajoutEtudiant') setPage('classes')
    else if (page === 'fiche' || page === 'ajoutNote') setPage('etudiants')
    else if (page === 'ajoutClasse') setPage('classes')
  }

  function titreNavbar() {
    if (page === 'etudiants' || page === 'ajoutEtudiant') return classeActive?.nom || 'Classe'
    if (page === 'fiche' || page === 'ajoutNote') return etudiantActif?.nom || 'Élève'
    return 'EduGest'
  }

  function rendrePage() {
    switch (page) {
      case 'classesDuProf':
        return <ClasseList classes={classesDuProf} etudiants={etudiants} onOuvrir={ouvrirClasse} onSupprimer={supprimerClasse} onAjouter={() => setPage('ajoutClasse')} onModifier={modifierClasse} />
      case 'ajoutClasse':
        return <ClasseForm onSauvegarder={ajouterClasse} />
      case 'etudiants':
        return <EtudiantList classe={classeActive} etudiants={etudiants.filter(e => e.classeId === classeActive?.id)} onOuvrir={ouvrirFiche} onSupprimer={supprimerEtudiant} onAjouter={() => setPage('ajoutEtudiant')} onModifier={modifierEtudiant} />
      case 'ajoutEtudiant':
        return <EtudiantForm classe={classeActive} onSauvegarder={ajouterEtudiant} />
      case 'fiche':
        return <EtudiantFiche etudiant={etudiantActif} notes={notes.filter(n => n.etudiantId === etudiantActif?.id)} onSupprimerNote={supprimerNote} onAjouterNote={() => setPage('ajoutNote')} />
      case 'ajoutNote':
        return <NoteForm onSauvegarder={ajouterNote} />
      default:
        return <ClasseList classes={classes} etudiants={etudiants} onOuvrir={ouvrirClasse} onSupprimer={supprimerClasse} onAjouter={() => setPage('ajoutClasse')} onModifier={modifierClasse} />
    }
  }

  if (loading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.card}>
          <div style={loaderStyles.logoWrap}><span style={loaderStyles.logo}>🎓</span></div>
          <h1 style={loaderStyles.titre}>EduGest</h1>
          <p style={loaderStyles.sous}>Connexion à la base de données...</p>
          <div style={loaderStyles.barreWrap}><div style={loaderStyles.barre}></div></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <Navbar titre={titreNavbar()} page={page} onRetour={retour} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {rendrePage()}
      </div>
    </div>
  )
}

const loaderStyles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 50%, #a78bfa 100%)' },
  card: { backgroundColor: 'white', borderRadius: '28px', padding: '3rem 4rem', textAlign: 'center', boxShadow: '0 32px 80px rgba(91,79,255,0.3)' },
  logoWrap: { width: '80px', height: '80px', backgroundColor: '#ede9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  logo: { fontSize: '2.5rem' },
  titre: { fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#1a1535', marginBottom: '0.4rem' },
  sous: { color: '#8b87a8', fontSize: '0.95rem', marginBottom: '2rem' },
  barreWrap: { width: '200px', height: '4px', backgroundColor: '#ede9ff', borderRadius: '99px', margin: '0 auto', overflow: 'hidden' },
  barre: { height: '100%', width: '60%', backgroundColor: '#5b4fff', borderRadius: '99px', animation: 'pulse 1.2s ease-in-out infinite' },
}

export default App