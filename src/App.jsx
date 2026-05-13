import { useState, useEffect } from "react"
import Connexion from './components/auth/Connexion'
import Inscription from './components/auth/Inscription'
import Verification from './components/auth/Verification'
import AdminDashboard from './components/admin/AdminDashboard'
import ProfDashboard from './components/prof/ProfDashboard'
import {
  getClasses, ajouterClasseDB, supprimerClasseDB, modifierClasseDB,
  getEtudiants, ajouterEtudiantDB, supprimerEtudiantDB, modifierEtudiantDB,
  getNotes, ajouterNoteDB, supprimerNoteDB,
  getProfs, setEnLigneDB
} from './firebaseService'

function App() {
  const [authPage, setAuthPage] = useState('connexion')
  const [profConnecte, setProfConnecte] = useState(() => {
    const saved = localStorage.getItem('profConnecte')
    return saved ? JSON.parse(saved) : null
  })
  const [formInscription, setFormInscription] = useState(null)
  const [codeAttendu, setCodeAttendu] = useState(null)

  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const [etudiants, setEtudiants] = useState([])
  const [notes, setNotes] = useState([])
  const [profs, setProfs] = useState([])

  useEffect(() => {
    chargerDonnees()
  }, [])

  // Met à jour le statut en ligne
  useEffect(() => {
    if (profConnecte?.id) {
      setEnLigneDB(profConnecte.id, true)
      const handleUnload = () => setEnLigneDB(profConnecte.id, false)
      window.addEventListener('beforeunload', handleUnload)
      return () => {
        window.removeEventListener('beforeunload', handleUnload)
        setEnLigneDB(profConnecte.id, false)
      }
    }
  }, [profConnecte])

  async function chargerDonnees() {
    setLoading(true)
    try {
      const [cls, etu, nts, prf] = await Promise.all([
        getClasses(), getEtudiants(), getNotes(), getProfs()
      ])
      setClasses(cls)
      setEtudiants(etu)
      setNotes(nts)
      setProfs(prf)
    } catch (err) {
      console.error('Erreur chargement:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── Auth ──────────────────────────────────────────
  function onCodeEnvoye(form, code) {
    setFormInscription(form)
    setCodeAttendu(code)
    setAuthPage('verification')
  }

  function onConnecte(user) {
    setProfConnecte(user)
    localStorage.setItem('profConnecte', JSON.stringify(user))
  }

  async function seDeconnecter() {
    if (profConnecte?.id) await setEnLigneDB(profConnecte.id, false)
    setProfConnecte(null)
    localStorage.removeItem('profConnecte')
    setAuthPage('connexion')
  }

  // ── Classes ───────────────────────────────────────
  async function ajouterClasse(nom) {
    const id = await ajouterClasseDB(nom)
    setClasses(prev => [...prev, { id, nom }])
  }

  async function supprimerClasse(id) {
    if (!window.confirm('Supprimer cette classe ?')) return
    const etudiantsIds = etudiants.filter(e => e.classeId === id).map(e => e.id)
    await supprimerClasseDB(id)
    for (const eid of etudiantsIds) {
      await supprimerEtudiantDB(eid)
      for (const n of notes.filter(n => n.etudiantId === eid)) await supprimerNoteDB(n.id)
    }
    setClasses(prev => prev.filter(c => c.id !== id))
    setEtudiants(prev => prev.filter(e => e.classeId !== id))
    setNotes(prev => prev.filter(n => !etudiantsIds.includes(n.etudiantId)))
  }

  async function modifierClasse(id, nom) {
    await modifierClasseDB(id, nom)
    setClasses(prev => prev.map(c => c.id === id ? { ...c, nom } : c))
  }

  // ── Étudiants ─────────────────────────────────────
  async function ajouterEtudiant(nom, classeId) {
    const id = await ajouterEtudiantDB(nom, classeId)
    setEtudiants(prev => [...prev, { id, nom, classeId }])
  }

  async function supprimerEtudiant(id) {
    if (!window.confirm('Supprimer cet étudiant ?')) return
    await supprimerEtudiantDB(id)
    for (const n of notes.filter(n => n.etudiantId === id)) await supprimerNoteDB(n.id)
    setEtudiants(prev => prev.filter(e => e.id !== id))
    setNotes(prev => prev.filter(n => n.etudiantId !== id))
  }

  async function modifierEtudiant(id, nom) {
    await modifierEtudiantDB(id, nom)
    setEtudiants(prev => prev.map(e => e.id === id ? { ...e, nom } : e))
  }

  // ── Notes ─────────────────────────────────────────
  async function ajouterNote(note, etudiantId) {
    const noteComplete = { ...note, etudiantId, date: new Date().toLocaleDateString('fr-FR') }
    const id = await ajouterNoteDB(noteComplete)
    setNotes(prev => [...prev, { ...noteComplete, id }])
  }

  async function supprimerNote(id) {
    if (!window.confirm('Supprimer cette note ?')) return
    await supprimerNoteDB(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  // ── Loader ────────────────────────────────────────
  if (loading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.card}>
          <div style={loaderStyles.logoWrap}>🎓</div>
          <h1 style={loaderStyles.titre}>Samju43</h1>
          <p style={loaderStyles.sous}>Chargement en cours...</p>
          <div style={loaderStyles.barreWrap}>
            <div style={loaderStyles.barre}></div>
          </div>
        </div>
      </div>
    )
  }

  // ── Auth ──────────────────────────────────────────
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
          onSuccess={onConnecte}
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

  // ── Admin ─────────────────────────────────────────
  if (profConnecte.role === 'admin') {
    return (
      <AdminDashboard
        classes={classes}
        etudiants={etudiants}
        notes={notes}
        profs={profs}
        onAjouterClasse={ajouterClasse}
        onSupprimerClasse={supprimerClasse}
        onModifierClasse={modifierClasse}
        onAjouterEtudiant={ajouterEtudiant}
        onSupprimerEtudiant={supprimerEtudiant}
        onModifierEtudiant={modifierEtudiant}
        onAjouterNote={ajouterNote}
        onSupprimerNote={supprimerNote}
        onDeconnecter={seDeconnecter}
      />
    )
  }

  // ── Prof ──────────────────────────────────────────
  return (
    <ProfDashboard
      prof={profConnecte}
      classes={classes}
      etudiants={etudiants}
      notes={notes}
      onAjouterNote={ajouterNote}
      onSupprimerNote={supprimerNote}
      onDeconnecter={seDeconnecter}
    />
  )
}

const loaderStyles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 100%)' },
  card: { backgroundColor: 'white', borderRadius: '28px', padding: '3rem 4rem', textAlign: 'center', boxShadow: '0 32px 80px rgba(91,79,255,0.3)' },
  logoWrap: { fontSize: '3rem', marginBottom: '1rem' },
  titre: { fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 800, color: '#1a1535', marginBottom: '0.4rem' },
  sous: { color: '#8b87a8', fontSize: '0.95rem', marginBottom: '2rem' },
  barreWrap: { width: '200px', height: '4px', backgroundColor: '#ede9ff', borderRadius: '99px', margin: '0 auto', overflow: 'hidden' },
  barre: { height: '100%', width: '60%', backgroundColor: '#5b4fff', borderRadius: '99px', animation: 'pulse 1.2s ease-in-out infinite' },
}

export default App