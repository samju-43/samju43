import { useState } from 'react'
import { genererCode, envoyerCodeConfirmation } from '../../emailService'

function Inscription({ classes, onCodeEnvoye, onConnexion }) {
  const [etape, setEtape] = useState('formulaire') // 'formulaire' | 'envoi'
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    etablissement: '',
    matiere: '',
    classesGerees: []
  })
  const [erreur, setErreur] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleClasse(classeId) {
    setForm(prev => ({
      ...prev,
      classesGerees: prev.classesGerees.includes(classeId)
        ? prev.classesGerees.filter(id => id !== classeId)
        : [...prev.classesGerees, classeId]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    if (!form.prenom || !form.nom || !form.email || !form.etablissement || !form.matiere) {
      setErreur('Merci de remplir tous les champs.')
      return
    }
    if (form.classesGerees.length === 0) {
      setErreur('Sélectionne au moins une classe.')
      return
    }

    setEtape('envoi')
    try {
      const code = genererCode()
      await envoyerCodeConfirmation(form.email, form.prenom, form.nom, code)
      onCodeEnvoye(form, code)
    } catch (err) {
      setErreur('Erreur envoi mail. Vérifie ta config EmailJS.')
      setEtape('formulaire')
    }
  }

  const matieres = ['Mathématiques', 'Français', 'Histoire-Géo', 'Anglais', 'Sciences', 'Philosophie', 'SVT', 'Physique-Chimie', 'Informatique', 'EPS']

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🎓</div>
        <h2 style={styles.titre}>Créer un compte</h2>
        <p style={styles.sous}>Inscription professeur — Samju43</p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        {etape === 'envoi' ? (
          <div style={styles.chargement}>
            <div style={styles.spinner}></div>
            <p>Envoi du code de confirmation...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>

            {/* Prénom + Nom */}
            <div style={styles.ligne}>
              <div style={styles.champWrap}>
                <label style={styles.label}>Prénom</label>
                <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Alice" style={styles.input} />
              </div>
              <div style={styles.champWrap}>
                <label style={styles.label}>Nom</label>
                <input name="nom" value={form.nom} onChange={handleChange} placeholder="Martin" style={styles.input} />
              </div>
            </div>

            {/* Email */}
            <div style={styles.champWrap}>
              <label style={styles.label}>Adresse email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alice.martin@ecole.fr" style={styles.input} />
            </div>

            {/* Établissement */}
            <div style={styles.champWrap}>
              <label style={styles.label}>Établissement</label>
              <input name="etablissement" value={form.etablissement} onChange={handleChange} placeholder="Lycée Victor Hugo" style={styles.input} />
            </div>

            {/* Matière */}
            <div style={styles.champWrap}>
              <label style={styles.label}>Matière enseignée</label>
              <select name="matiere" value={form.matiere} onChange={handleChange} style={styles.input}>
                <option value="">Sélectionne une matière</option>
                {matieres.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Classes gérées */}
            <div style={styles.champWrap}>
              <label style={styles.label}>Classes gérées</label>
              {classes.length === 0 ? (
                <p style={styles.pasDeClasse}>Aucune classe disponible pour l'instant.</p>
              ) : (
                <div style={styles.classesGrid}>
                  {classes.map(c => (
                    <div
                      key={c.id}
                      style={{
                        ...styles.classeChip,
                        ...(form.classesGerees.includes(c.id) ? styles.classeChipActif : {})
                      }}
                      onClick={() => toggleClasse(c.id)}
                    >
                      {form.classesGerees.includes(c.id) ? '✓ ' : ''}{c.nom}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={styles.btn}>
              Recevoir le code de confirmation →
            </button>

            <p style={styles.lienConnexion}>
              Déjà un compte ?{' '}
              <span style={styles.lien} onClick={onConnexion}>Se connecter</span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 100%)',
    padding: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 32px 80px rgba(91,79,255,0.25)',
  },
  iconWrap: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  titre: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1a1535',
    textAlign: 'center',
    marginBottom: '0.3rem',
    fontFamily: "'Outfit', sans-serif",
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  erreur: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  ligne: {
    display: 'flex',
    gap: '1rem',
  },
  champWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
  label: {
    fontWeight: 600,
    color: '#1a1535',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '2px solid #e8e5ff',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#1a1535',
    backgroundColor: '#faf9ff',
    width: '100%',
    fontFamily: "'DM Sans', sans-serif",
  },
  classesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  classeChip: {
    padding: '0.4rem 0.9rem',
    borderRadius: '99px',
    border: '2px solid #e8e5ff',
    fontSize: '0.85rem',
    cursor: 'pointer',
    color: '#8b87a8',
    fontWeight: 600,
    transition: 'all 0.2s',
    userSelect: 'none',
  },
  classeChipActif: {
    backgroundColor: '#5b4fff',
    borderColor: '#5b4fff',
    color: 'white',
  },
  pasDeClasse: {
    color: '#8b87a8',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
  btn: {
    backgroundColor: '#5b4fff',
    color: 'white',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 700,
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(91,79,255,0.35)',
    fontFamily: "'Outfit', sans-serif",
  },
  lienConnexion: {
    textAlign: 'center',
    color: '#8b87a8',
    fontSize: '0.9rem',
  },
  lien: {
    color: '#5b4fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  chargement: {
    textAlign: 'center',
    padding: '2rem',
    color: '#8b87a8',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e8e5ff',
    borderTop: '4px solid #5b4fff',
    borderRadius: '50%',
    margin: '0 auto 1rem',
    animation: 'spin 1s linear infinite',
  },
}

export default Inscription