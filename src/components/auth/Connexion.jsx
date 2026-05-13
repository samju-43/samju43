import { useState } from 'react'
import { getProf } from '../../firebaseService'

const ADMIN_EMAIL = 'samuelnziengui18@gmail.com'
const ADMIN_PASSWORD = '123456789'

function Connexion({ onConnecte, onInscription }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    try {
      // Vérif admin
      if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        if (motDePasse === ADMIN_PASSWORD) {
          onConnecte({ role: 'admin', email: ADMIN_EMAIL, nom: 'Admin', prenom: 'Super' })
        } else {
          setErreur('Mot de passe admin incorrect.')
        }
        return
      }

      // Vérif prof
      const prof = await getProf(email.trim().toLowerCase(), motDePasse)
      if (!prof) {
        setErreur('Email ou mot de passe incorrect.')
        return
      }
      if (prof === 'bloque') {
        setErreur('Ton compte a été bloqué. Contacte l\'administrateur.')
        return
      }
      onConnecte({ ...prof, role: 'prof' })

    } catch (err) {
      setErreur('Erreur de connexion. Réessaie.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>🎓</div>
        <h1 style={styles.appName}>EduGest</h1>
        <p style={styles.sous}>Connecte-toi à ton espace</p>

        {erreur && <div style={styles.erreur}>⚠️ {erreur}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.champWrap}>
            <label style={styles.label}>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com"
              style={styles.input}
              autoFocus
            />
          </div>

          <div style={styles.champWrap}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.btn} disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter →'}
          </button>

          <p style={styles.lienInscription}>
            Pas encore de compte ?{' '}
            <span style={styles.lien} onClick={onInscription}>S'inscrire</span>
          </p>
        </form>
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
    maxWidth: '420px',
    boxShadow: '0 32px 80px rgba(91,79,255,0.25)',
    textAlign: 'center',
  },
  logoWrap: { fontSize: '3rem', marginBottom: '0.5rem' },
  appName: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1a1535',
    fontFamily: "'Outfit', sans-serif",
    marginBottom: '0.3rem',
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.9rem',
    marginBottom: '1.8rem',
  },
  erreur: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  champWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontWeight: 600,
    color: '#1a1535',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '2px solid #e8e5ff',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#1a1535',
    backgroundColor: '#faf9ff',
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
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
    boxShadow: '0 4px 12px rgba(91,79,255,0.35)',
    fontFamily: "'Outfit', sans-serif",
    marginTop: '0.5rem',
  },
  lienInscription: {
    textAlign: 'center',
    color: '#8b87a8',
    fontSize: '0.9rem',
  },
  lien: {
    color: '#5b4fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
}

export default Connexion