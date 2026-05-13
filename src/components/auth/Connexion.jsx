import { useState } from 'react'
import { getProf } from '../../firebaseService'

function Connexion({ onConnecte, onInscription }) {
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)

    try {
      const prof = await getProf(email.trim().toLowerCase())
      if (!prof) {
        setErreur('Aucun compte trouvé avec cet email.')
        return
      }
      onConnecte(prof)
    } catch (err) {
      setErreur('Erreur de connexion. Réessaie.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>🔐</div>
        <h2 style={styles.titre}>Connexion</h2>
        <p style={styles.sous}>Accède à ton espace professeur</p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.champWrap}>
            <label style={styles.label}>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=""
              style={styles.input}
              autoFocus
            />
          </div>

          <button type="submit" style={styles.btn} disabled={chargement}>
            {chargement ? 'Connexion...' : 'Se connecter →'}
          </button>

          <p style={styles.lienInscription}>
            Pas encore de compte ?{' '}
            <span style={styles.lien} onClick={onInscription}>
              S'inscrire
            </span>
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
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '2px solid #e8e5ff',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#1a1535',
    backgroundColor: '#faf9ff',
    fontFamily: "'DM Sans', sans-serif",
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