import { useState } from 'react'
import { ajouterProfesseurDB } from '../../firebaseService'

function Verification({ form, codeAttendu, onSuccess, onRetour }) {
  const [codeSaisi, setCodeSaisi] = useState('')
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    if (codeSaisi !== codeAttendu) {
      setErreur('Code incorrect. Vérifie ton mail.')
      return
    }

    setChargement(true)
    try {
      await ajouterProfesseurDB(form)
      onSuccess(form)
    } catch (err) {
      setErreur('Erreur lors de la création du compte.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📬</div>
        <h2 style={styles.titre}>Vérification</h2>
        <p style={styles.sous}>
          Un code a été envoyé à <strong>{form.email}</strong>
        </p>

        {erreur && <div style={styles.erreur}>{erreur}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.champWrap}>
            <label style={styles.label}>Code de confirmation</label>
            <input
              type="text"
              value={codeSaisi}
              onChange={e => setCodeSaisi(e.target.value)}
              placeholder=""
              maxLength={6}
              style={styles.inputCode}
              autoFocus
            />
          </div>

          <button type="submit" style={styles.btn} disabled={chargement}>
            {chargement ? 'Création du compte...' : 'Confirmer →'}
          </button>

          <p style={styles.retour}>
            <span style={styles.lien} onClick={onRetour}>
              ← Modifier mes informations
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
    textAlign: 'center',
  },
  iconWrap: { fontSize: '2.5rem', marginBottom: '1rem' },
  titre: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1a1535',
    marginBottom: '0.3rem',
    fontFamily: "'Outfit', sans-serif",
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  erreur: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    marginBottom: '1rem',
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
  inputCode: {
    padding: '1rem',
    borderRadius: '10px',
    border: '2px solid #e8e5ff',
    fontSize: '1.8rem',
    fontWeight: 800,
    textAlign: 'center',
    outline: 'none',
    letterSpacing: '0.5rem',
    color: '#5b4fff',
    fontFamily: "'Outfit', sans-serif",
    backgroundColor: '#faf9ff',
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
  },
  retour: {
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

export default Verification