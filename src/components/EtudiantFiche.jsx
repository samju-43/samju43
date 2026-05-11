function EtudiantFiche({ etudiant, notes, onAjouterNote, onSupprimerNote }) {

  function calculerMoyenne() {
    if (notes.length === 0) return null;
    const total = notes.reduce((acc, n) => acc + Number(n.valeur), 0);
    return (total / notes.length).toFixed(2);
  }

  function couleurMoyenne(val) {
    const v = Number(val);
    if (v >= 14) return '#22c55e';   // ✅ # manquait dans ton code original
    if (v >= 10) return '#f59e0b';
    return '#ef4444';
  }

  function labelMoyenne(val) {
    const v = Number(val);
    if (v >= 16) return 'Excellent';
    if (v >= 14) return 'Très bien';
    if (v >= 12) return 'Bien';
    if (v >= 10) return 'Assez bien';
    return 'Insuffisant';
  }

  const moyenne = calculerMoyenne();
  const meilleureNote = notes.length ? Math.max(...notes.map(n => Number(n.valeur))) : null;
  const pireNote = notes.length ? Math.min(...notes.map(n => Number(n.valeur))) : null;

  return (
    <div style={styles.container} className="page-enter">

      {/* Carte étudiant */}
      <div style={styles.carteEtudiant}>
        <div style={styles.avatarGrand}>
          {etudiant.nom.charAt(0).toUpperCase()}
        </div>
        <div style={styles.infoEtudiant}>
          <h2 style={styles.nom}>{etudiant.nom}</h2>
          <p style={styles.sousTitre}>{notes.length} note{notes.length !== 1 ? 's' : ''} enregistrée{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={styles.btnAjouter} onClick={onAjouterNote}>
          + Ajouter une note
        </button>
      </div>

      {/* Stats */}
      {moyenne !== null && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Moyenne</p>
            <p style={{ ...styles.statVal, color: couleurMoyenne(moyenne) }}>
              {moyenne}<span style={styles.statUnit}>/20</span>
            </p>
            <span style={{ ...styles.statBadge, backgroundColor: couleurMoyenne(moyenne) + '18', color: couleurMoyenne(moyenne) }}>
              {labelMoyenne(moyenne)}
            </span>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Meilleure note</p>
            <p style={{ ...styles.statVal, color: '#22c55e' }}>
              {meilleureNote}<span style={styles.statUnit}>/20</span>
            </p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Note la plus basse</p>
            <p style={{ ...styles.statVal, color: '#ef4444' }}>
              {pireNote}<span style={styles.statUnit}>/20</span>
            </p>
          </div>
        </div>
      )}

      {/* Liste des notes */}
      <h3 style={styles.sectionTitre}>Détail des notes</h3>

      {notes.length === 0 ? (
        <div style={styles.vide}>
          <div style={styles.videIcone}>📋</div>
          <p style={styles.videText}>Aucune note enregistrée pour cet étudiant.</p>
          <button style={styles.btnAjouter} onClick={onAjouterNote}>+ Ajouter une note</button>
        </div>
      ) : (
        <div style={styles.liste}>
          {notes.map(note => {
            const couleur = couleurMoyenne(note.valeur);
            return (
              <div key={note.id} style={styles.card}>
                <div style={{ ...styles.noteBarre, backgroundColor: couleur }}></div>
                <div style={styles.noteContenu}>
                  <div style={styles.noteGauche}>
                    <div style={{ ...styles.noteVal, color: couleur }}>
                      {note.valeur}<span style={styles.noteValUnit}>/20</span>
                    </div>
                    <div>
                      <p style={styles.matiere}>{note.matiere}</p>
                      <p style={styles.prof}>👨‍🏫 {note.professeur}</p>
                      <p style={styles.date}>📅 {note.date}</p>
                    </div>
                  </div>
                  <div style={styles.noteDroite}>
                    <span style={{ ...styles.noteBadge, backgroundColor: couleur + '15', color: couleur }}>
                      {labelMoyenne(note.valeur)}
                    </span>
                    <button
                      style={styles.btnSupp}
                      onClick={() => onSupprimerNote(note.id)}
                      title="Supprimer"
                    >🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '0.5rem 0' },
  carteEtudiant: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    padding: '1.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    marginBottom: '1.2rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
  },
  avatarGrand: {
    width: '56px',
    height: '56px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1.4rem',
    fontFamily: "'Outfit', sans-serif",
    flexShrink: 0,
  },
  infoEtudiant: { flex: 1 },
  nom: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.3px',
  },
  sousTitre: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginTop: '2px',
  },
  btnAjouter: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.2rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(91,79,255,0.35)',
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius-sm)',
    padding: '1.2rem',
    textAlign: 'center',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.4rem',
  },
  statVal: {
    fontSize: '2rem',
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  statUnit: {
    fontSize: '1rem',
    fontWeight: 500,
    opacity: 0.6,
  },
  statBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.7rem',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  sectionTitre: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '0.8rem',
  },
  liste: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border)',
    display: 'flex',
  },
  noteBarre: {
    width: '5px',
    flexShrink: 0,
  },
  noteContenu: {
    flex: 1,
    padding: '1rem 1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteGauche: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  noteVal: {
    fontSize: '1.8rem',
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    minWidth: '60px',
    lineHeight: 1,
  },
  noteValUnit: {
    fontSize: '0.9rem',
    fontWeight: 500,
    opacity: 0.6,
  },
  matiere: {
    fontWeight: 700,
    color: 'var(--text)',
    fontSize: '0.95rem',
  },
  prof: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    margin: '0.2rem 0',
  },
  date: {
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
  },
  noteDroite: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  noteBadge: {
    padding: '0.25rem 0.7rem',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  btnSupp: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    opacity: 0.5,
  },
  vide: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    border: '2px dashed var(--border)',
  },
  videIcone: { fontSize: '3rem', marginBottom: '1rem' },
  videText: {
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
};

export default EtudiantFiche;