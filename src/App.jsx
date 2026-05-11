import { useState, useEffect } from "react";
import ClasseList from './components/ClasseList';
import Navbar from './components/Navbar';
import ClasseForm from './components/ClasseForm';
import EtudiantList from './components/EtudiantList';
import EtudiantForm from './components/EtudiantForm';
import EtudiantFiche from './components/EtudiantFiche';
import NoteForm from "./components/NoteForm";

function App() {
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem("classes");
    return saved ? JSON.parse(saved) : [];
  });

  const [etudiants, setEtudiants] = useState(() => {
    const saved = localStorage.getItem("etudiants");
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [page, setPage] = useState('classes');
  const [classeActive, setClasseActive] = useState(null);
  const [etudiantActif, setEtudiantActif] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('etudiants', JSON.stringify(etudiants));
  }, [etudiants]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // ── Classes ───────────────────────────────────────
  function ajouterClasse(nom) {
    setClasses([...classes, { id: Date.now(), nom }]);
    setPage('classes');
  }

  function supprimerClasse(id) {
    if (!window.confirm('Supprimer cette classe et tous ses étudiants ?')) return;
    const etudiantsIds = etudiants.filter(e => e.classeId === id).map(e => e.id);
    setClasses(classes.filter(c => c.id !== id));
    setEtudiants(etudiants.filter(e => e.classeId !== id));
    setNotes(notes.filter(n => !etudiantsIds.includes(n.etudiantId)));
    setPage('classes');
  }

  function modifierClasse(id, nouveauNom) {
    setClasses(classes.map(c => c.id === id ? { ...c, nom: nouveauNom } : c));
  }

  // ── Étudiants ─────────────────────────────────────
  function ajouterEtudiant(nom) {
    setEtudiants([...etudiants, {
      id: Date.now(),
      nom,
      classeId: classeActive.id
    }]);
    setPage('etudiants');
  }

  function supprimerEtudiant(id) {
    if (!window.confirm('Supprimer cet étudiant et toutes ses notes ?')) return;
    setEtudiants(etudiants.filter(e => e.id !== id));
    setNotes(notes.filter(n => n.etudiantId !== id));
    setPage('etudiants');
  }

  function modifierEtudiant(id, nouveauNom) {
    setEtudiants(etudiants.map(e => e.id === id ? { ...e, nom: nouveauNom } : e));
    if (etudiantActif?.id === id) {
      setEtudiantActif(prev => ({ ...prev, nom: nouveauNom }));
    }
  }

  // ── Notes ─────────────────────────────────────────
  function ajouterNote(note) {
    setNotes([...notes, {
      ...note,
      id: Date.now(),
      etudiantId: etudiantActif.id,
      date: new Date().toLocaleDateString('fr-FR')
    }]);
    setPage('fiche');
  }

  function supprimerNote(id) {
    if (!window.confirm('Supprimer cette note ?')) return;
    setNotes(notes.filter(n => n.id !== id));
  }

  // ── Navigation ────────────────────────────────────
  function ouvrirClasse(classe) {
    setClasseActive(classe);
    setPage('etudiants');
  }

  function ouvrirFiche(etudiant) {
    setEtudiantActif(etudiant);
    setPage('fiche');
  }

  function retour() {
    if (page === 'etudiants' || page === 'ajoutEtudiant') setPage('classes');
    else if (page === 'fiche' || page === 'ajoutNote') setPage('etudiants');
    else if (page === 'ajoutClasse') setPage('classes');
  }

  function titreNavbar() {
    if (page === 'etudiants' || page === 'ajoutEtudiant') return classeActive?.nom || 'Classe';
    if (page === 'fiche' || page === 'ajoutNote') return etudiantActif?.nom || 'Élève';
    return 'Samju43';
  }

  function rendrePage() {
    switch (page) {
      case 'classes':
        return (
          <ClasseList
            classes={classes}
            etudiants={etudiants}
            onOuvrir={ouvrirClasse}
            onSupprimer={supprimerClasse}
            onAjouter={() => setPage('ajoutClasse')}
            onModifier={modifierClasse}
          />
        );
      case 'ajoutClasse':
        return <ClasseForm onSauvegarder={ajouterClasse} />;
      case 'etudiants':
        return (
          <EtudiantList
            classe={classeActive}
            etudiants={etudiants.filter(e => e.classeId === classeActive?.id)}
            onOuvrir={ouvrirFiche}
            onSupprimer={supprimerEtudiant}
            onAjouter={() => setPage('ajoutEtudiant')}
            onModifier={modifierEtudiant}
          />
        );
      case 'ajoutEtudiant':
        return <EtudiantForm classe={classeActive} onSauvegarder={ajouterEtudiant} />;
      case 'fiche':
        return (
          <EtudiantFiche
            etudiant={etudiantActif}
            notes={notes.filter(n => n.etudiantId === etudiantActif?.id)}
            onSupprimerNote={supprimerNote}
            onAjouterNote={() => setPage('ajoutNote')}
          />
        );
      case 'ajoutNote':
        return <NoteForm onSauvegarder={ajouterNote} />;
      default:
        return <ClasseList classes={classes} etudiants={etudiants} onOuvrir={ouvrirClasse} onSupprimer={supprimerClasse} onAjouter={() => setPage('ajoutClasse')} onModifier={modifierClasse} />;
    }
  }

  if (loading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.card}>
          <div style={loaderStyles.logoWrap}>
            <span style={loaderStyles.logo}>🎓</span>
          </div>
          <h1 style={loaderStyles.titre}>EduGest</h1>
          <p style={loaderStyles.sous}>Système de gestion scolaire</p>
          <div style={loaderStyles.barreWrap}>
            <div style={loaderStyles.barre}></div>
          </div>
          <p style={loaderStyles.loading}>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <Navbar titre={titreNavbar()} page={page} onRetour={retour} />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }} className="page-enter">
        {rendrePage()}
      </div>
    </div>
  );
}

const loaderStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 50%, #a78bfa 100%)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '28px',
    padding: '3rem 4rem',
    textAlign: 'center',
    boxShadow: '0 32px 80px rgba(91,79,255,0.3)',
  },
  logoWrap: {
    width: '80px',
    height: '80px',
    backgroundColor: '#ede9ff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  logo: {
    fontSize: '2.5rem',
  },
  titre: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#1a1535',
    marginBottom: '0.4rem',
    letterSpacing: '-0.5px',
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.95rem',
    marginBottom: '2rem',
  },
  barreWrap: {
    width: '200px',
    height: '4px',
    backgroundColor: '#ede9ff',
    borderRadius: '99px',
    margin: '0 auto 1rem',
    overflow: 'hidden',
  },
  barre: {
    height: '100%',
    width: '60%',
    backgroundColor: '#5b4fff',
    borderRadius: '99px',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  loading: {
    color: '#8b87a8',
    fontSize: '0.85rem',
  }
};

export default App;