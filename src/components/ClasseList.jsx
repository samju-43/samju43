import { useState } from 'react';

function ClasseList({ classes, etudiants, onOuvrir, onSupprimer, onAjouter, onModifier }) {
  const [editId, setEditId] = useState(null);
  const [editNom, setEditNom] = useState('');

  function demarrerEdit(e, classe) {
    e.stopPropagation();
    setEditId(classe.id);
    setEditNom(classe.nom);
  }

  function validerEdit(e) {
    e.preventDefault();
    if (editNom.trim()) {
      onModifier(editId, editNom.trim());
    }
    setEditId(null);
  }

  function nbEtudiants(classeId) {
    return etudiants.filter(e => e.classeId === classeId).length;
  }

  const couleurs = ['#5b4fff', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#06b6d4'];

  return (
    <div style={styles.container} className="page-enter">

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.titre}>Mes Classes</h2>
          <p style={styles.sous}>{classes.length} classe{classes.length !== 1 ? 's' : ''} enregistrée{classes.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={styles.btnAjouter} onClick={onAjouter}>
          + Nouvelle classe
        </button>
      </div>

      {/* Vide */}
      {classes.length === 0 ? (
        <div style={styles.vide}>
          <div style={styles.videIcone}>🏫</div>
          <h3 style={styles.videTitle}>Aucune classe</h3>
          <p style={styles.videText}>Commence par créer ta première classe !</p>
          <button style={styles.btnAjouter} onClick={onAjouter}>
            + Nouvelle classe
          </button>
        </div>
      ) : (
        <div style={styles.grille}>
          {classes.map((classe, index) => {
            const nb = nbEtudiants(classe.id);
            const couleur = couleurs[index % couleurs.length];
            return (
              <div
                key={classe.id}
                style={{ ...styles.card, '--couleur': couleur }}
                onClick={() => editId !== classe.id && onOuvrir(classe)}
              >
                {/* Bande colorée */}
                <div style={{ ...styles.bande, backgroundColor: couleur }}></div>

                <div style={styles.cardBody}>
                  {/* Icône + Nom */}
                  <div style={styles.cardTop}>
                    <div style={{ ...styles.iconWrap, backgroundColor: couleur + '18' }}>
                      <span style={{ ...styles.icone, color: couleur }}>🏫</span>
                    </div>
                    <div style={styles.actions}>
                      <button
                        style={styles.btnEdit}
                        onClick={e => demarrerEdit(e, classe)}
                        title="Modifier"
                      >✏️</button>
                      <button
                        style={styles.btnSupp}
                        onClick={e => { e.stopPropagation(); onSupprimer(classe.id); }}
                        title="Supprimer"
                      >🗑️</button>
                    </div>
                  </div>

                  {/* Nom modifiable */}
                  {editId === classe.id ? (
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
                    <h3 style={styles.nomClasse}>{classe.nom}</h3>
                  )}

                  {/* Badge étudiants */}
                  <div style={styles.cardFooter}>
                    <span style={{ ...styles.badgeNb, color: couleur, backgroundColor: couleur + '15' }}>
                      👥 {nb} étudiant{nb !== 1 ? 's' : ''}
                    </span>
                    <span style={{ ...styles.fleche, color: couleur }}>→</span>
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
  container: {
    padding: '0.5rem 0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
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
  grille: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid var(--border)',
    position: 'relative',
  },
  bande: {
    height: '5px',
    width: '100%',
  },
  cardBody: {
    padding: '1.3rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.8rem',
  },
  iconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    fontSize: '1.4rem',
  },
  actions: {
    display: 'flex',
    gap: '4px',
  },
  btnEdit: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    opacity: 0.5,
  },
  btnSupp: {
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    opacity: 0.5,
  },
  nomClasse: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '0.8rem',
  },
  inputEdit: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    borderRadius: '8px',
    border: '2px solid var(--primary)',
    fontSize: '1rem',
    fontWeight: 600,
    outline: 'none',
    marginBottom: '0.8rem',
    fontFamily: "'Outfit', sans-serif",
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeNb: {
    fontSize: '0.8rem',
    fontWeight: 600,
    padding: '0.3rem 0.7rem',
    borderRadius: '99px',
  },
  fleche: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  vide: {
    textAlign: 'center',
    padding: '5rem 2rem',
    backgroundColor: 'white',
    borderRadius: 'var(--radius)',
    border: '2px dashed var(--border)',
  },
  videIcone: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
  },
  videTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '0.5rem',
  },
  videText: {
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
};

export default ClasseList;