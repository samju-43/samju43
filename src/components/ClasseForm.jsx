import { useState } from 'react';

function ClasseForm({ onSauvegarder }) {
  const [nom, setNom] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!nom.trim()) {
      alert("Merci d'entrer un nom de classe !");
      return;
    }
    onSauvegarder(nom.trim());
  }

  return (
    <div style={styles.container} className="page-enter">
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <span style={styles.icone}>🏫</span>
        </div>
        <h2 style={styles.titre}>Nouvelle Classe</h2>
        <p style={styles.sous}>Ajoute une nouvelle classe à ton établissement</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.champWrap}>
            <label style={styles.label}>Nom de la classe</label>
            <input
              type="text"
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder=""
              style={styles.input}
              autoFocus
            />
          </div>
          <button type="submit" style={styles.btn}>
            Créer la classe →
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border)',
    textAlign: 'center',
  },
  iconWrap: {
    width: '64px',
    height: '64px',
    backgroundColor: 'var(--primary-light)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.2rem',
    fontSize: '1.8rem',
  },
  icone: { fontSize: '1.8rem' },
  titre: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text)',
    marginBottom: '0.4rem',
    letterSpacing: '-0.3px',
  },
  sous: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '2rem',
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
    color: 'var(--text)',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid var(--border)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    color: 'var(--text)',
    backgroundColor: 'var(--surface2)',
  },
  btn: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.9rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 700,
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(91,79,255,0.35)',
    letterSpacing: '0.2px',
  },
};

export default ClasseForm;