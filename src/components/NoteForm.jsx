import { useState } from 'react';

function NoteForm({ onSauvegarder }) {
  const [matiere, setMatiere] = useState('');
  const [professeur, setProfesseur] = useState('');
  const [valeur, setValeur] = useState('');

  const matieresSuggestions = ['Mathématiques', 'Français', 'Histoire-Géo', 'Anglais', 'Sciences', 'Philosophie', 'SVT', 'Physique-Chimie'];

  function handleSubmit(e) {
    e.preventDefault();
    if (!matiere.trim() || !professeur.trim() || valeur === '') {
      alert('Merci de remplir tous les champs !');
      return;
    }
    if (valeur < 0 || valeur > 20) {
      alert('La note doit être entre 0 et 20 !');
      return;
    }
    onSauvegarder({ matiere: matiere.trim(), professeur: professeur.trim(), valeur: Number(valeur) });
  }

  function couleurNote() {
    if (valeur === '') return 'var(--text-muted)';
    const v = Number(valeur);
    if (v >= 14) return '#22c55e';
    if (v >= 10) return '#f59e0b';
    return '#ef4444';
  }

  return (
    <div style={styles.container} className="page-enter">
      <div style={styles.card}>
        <div style={styles.iconWrap}>
          <span>📝</span>
        </div>
        <h2 style={styles.titre}>Ajouter une note</h2>
        <p style={styles.sous}>Renseigne les informations de la note</p>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Matière */}
          <div style={styles.champWrap}>
            <label style={styles.label}>Matière</label>
            <input
              type="text"
              value={matiere}
              onChange={e => setMatiere(e.target.value)}
              placeholder=""
              style={styles.input}
              list="matieres"
              autoFocus
            />
            <datalist id="matieres">
              {matieresSuggestions.map(m => <option key={m} value={m} />)}
            </datalist>
          </div>

          {/* Professeur */}
          <div style={styles.champWrap}>
            <label style={styles.label}>Professeur</label>
            <input
              type="text"
              value={professeur}
              onChange={e => setProfesseur(e.target.value)}
              placeholder=""
              style={styles.input}
            />
          </div>

          {/* Note */}
          <div style={styles.champWrap}>
            <label style={styles.label}>Note /20</label>
            <div style={styles.noteWrap}>
              <input
                type="number"
                value={valeur}
                onChange={e => setValeur(e.target.value)}
                placeholder=""
                min="0"
                max="20"
                step="0.5"
                style={{ ...styles.input, ...styles.noteInput }}
              />
              {valeur !== '' && (
                <div style={{ ...styles.notePreview, color: couleurNote(), borderColor: couleurNote() }}>
                  {Number(valeur).toFixed(1)}<span style={{ fontSize: '0.8rem', opacity: 0.7 }}>/20</span>
                </div>
              )}
            </div>
          </div>

          <button type="submit" style={styles.btn}>
            Enregistrer la note →
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
    color: 'var(--text)',
    backgroundColor: 'var(--surface2)',
    width: '100%',
  },
  noteWrap: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
  },
  noteInput: {
    flex: 1,
    width: 'auto',
  },
  notePreview: {
    fontSize: '1.4rem',
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    border: '2px solid',
    borderRadius: 'var(--radius-sm)',
    padding: '0.5rem 0.8rem',
    minWidth: '75px',
    textAlign: 'center',
    transition: 'color 0.3s, border-color 0.3s',
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
  },
};

export default NoteForm;