import { useState } from 'react';

function EtudiantList({ classe, etudiants, onOuvrir, onSupprimer, onAjouter, onModifier }) {
  const [recherche, setRecherche] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNom, setEditNom] = useState('');

  const etudiantsFiltres = etudiants.filter(e =>
    e.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  function demarrerEdit(e, etudiant) {
    e.stopPropagation();
    setEditId(etudiant.id);
    setEditNom(etudiant.nom);
  }

  function validerEdit(e) {
    e.preventDefault();
    if (editNom.trim()) {
      onModifier(editId, editNom.trim());
    }
    setEditId(null);
  }

  return (
    <div style={styles.container} className="page-enter">

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.titre}>Étudiants</h2>
          <p style={styles.sous}>
            {etudiants.length} étudiant{etudiants.length !== 1 ? 's' : ''} · {classe.nom}
          </p>
        </div>
        <button style={styles.btnAjouter} onClick={onAjouter}>
          + Ajouter
        </button>
      </div>

      {/* Barre de recherche */}
      {etudiants.length > 0 && (
        <div style={styles.rechercheWrap}>
          <span style={styles.rechercheIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            style={styles.rechercheInput}
          />
          {recherche && (
            <button style={styles.clearBtn} onClick={() => setRecherche('')}>✕</button>
          )}
        </div>
      )}

      {/* Vide */}
      {etudiants.length === 0 ? (
        <div style={styles.vide}>
          <div style={styles.videIcone}>👥</div>
          <h3 style={styles.videTitle}>Aucun étudiant</h3>
          <p style={styles.videText}>Ajoute des étudiants à la classe {classe.nom}</p>
          <button style={styles.btnAjouter} onClick={onAjouter}>+ Ajouter un étudiant</button>
        </div>
      ) : etudiantsFiltres.length === 0 ? (
        <div style={styles.vide}>
          <div style={styles.videIcone}>🔍</div>
          <p style={styles.videText}>Aucun résultat pour "<strong>{recherche}</strong>"</p>
        </div>
      ) : (
        <div style={styles.liste}>
          {etudiantsFiltres.map((etudiant, index) => (
            <div
              key={etudiant.id}
              style={styles.card}
              onClick={() => editId !== etudiant.id && onOuvrir(etudiant)}
            >
              <div style={styles.cardGauche}>
                <div style={styles.avatar}>
                  {etudiant.nom.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style={styles.numero}>#{index + 1}</span>
                  {editId === etudiant.id ? (
                    <form onSubmit={validerEdit} onClick={e => e.stopPropagation()}>
                      <input
                        style={styles.inputEdit}
                        value={editNom}
                        onChange={e => setEditNom(e.target.value)}
                        autoFocus
                        onBlur={validerEdit}
                      />
                    </form>
                  ) : (
                    <p style={styles.nom}>{etudiant.nom}</p>
                  )}
                </div>
              </div>

              <div style={styles.cardDroite}>
                <button
                  style={styles.btnEdit}
                  onClick={e => demarrerEdit(e, etudiant)}
                  title="Modifier"
                >✏️</button>
                <button
                  style={styles.btnSupp}
                  onClick={e => { e.stopPropagation(); onSupprimer(etudiant.id); }}
                  title="Supprimer"
                >🗑️</button>
                <span style={styles.fleche}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '0.5rem 0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  titre: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  sous: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginTop: '2px',
  },
  btnAjouter: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(91,79,255,0.35)',
  },
  rechercheWrap: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid var(--border)',
    padding: '0 1rem',
    marginBottom: '1.2rem',
    gap: '0.5rem',
  },
  rechercheIcon: { fontSize: '0.9rem' },
  rechercheInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '0.75rem 0',
    fontSize: '0.95rem',
    backgroundColor: 'transparent',
    color: 'var(--text)',
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  liste: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius-sm)',
    padding: '1rem 1.2rem',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1px solid var(--border)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardGauche: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '42px',
    height: '42px',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1.1rem',
    fontFamily: "'Outfit', sans-serif",
    flexShrink: 0,
  },
  numero: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
    display: 'block',
  },
  nom: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text)',
  },
  inputEdit: {
    padding: '0.3rem 0.5rem',
    borderRadius: '6px',
    border: '2px solid var(--primary)',
    fontSize: '1rem',
    fontWeight: 600,
    outline: 'none',
    fontFamily: "'Outfit', sans-serif",
  },
  cardDroite: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnEdit: {
    background: 'none',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '6px',
    opacity: 0.5,
  },
  btnSupp: {
    background: 'none',
    border: 'none',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '6px',
    opacity: 0.5,
  },
  fleche: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    marginLeft: '4px',
  },
  vide: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    border: '2px dashed var(--border)',
  },
  videIcone: { fontSize: '3rem', marginBottom: '1rem' },
  videTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '0.5rem',
  },
  videText: {
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
};

export default EtudiantList;