import { useState, useEffect } from 'react'
import { getProfs, bloquerProfDB } from '../../firebaseService'

function AdminProfs({ classes }) {
  const [profs, setProfs] = useState([])
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    chargerProfs()
  }, [])

  async function chargerProfs() {
    setChargement(true)
    const data = await getProfs()
    setProfs(data)
    setChargement(false)
  }

  async function toggleBloquer(prof) {
    const action = prof.bloque ? 'débloquer' : 'bloquer'
    if (!window.confirm(`Veux-tu ${action} ${prof.prenom} ${prof.nom} ?`)) return
    await bloquerProfDB(prof.id, !prof.bloque)
    setProfs(profs.map(p => p.id === prof.id ? { ...p, bloque: !p.bloque } : p))
  }

  function nomClasses(classesGerees) {
    if (!classesGerees?.length) return 'Aucune classe'
    return classesGerees
      .map(id => classes.find(c => c.id === id)?.nom || '?')
      .join(', ')
  }

  if (chargement) {
    return (
      <div style={styles.chargement}>
        <div style={styles.spinner}></div>
        <p>Chargement des professeurs...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.titre}>Professeurs</h2>
          <p style={styles.sous}>{profs.length} professeur{profs.length !== 1 ? 's' : ''} inscrit{profs.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statVal}>{profs.filter(p => p.enligne).length}</span>
            <span style={styles.statLabel}>En ligne</span>
          </div>
          <div style={styles.statItem}>
            <span style={{ ...styles.statVal, color: '#ef4444' }}>{profs.filter(p => p.bloque).length}</span>
            <span style={styles.statLabel}>Bloqués</span>
          </div>
        </div>
      </div>

      {profs.length === 0 ? (
        <div style={styles.vide}>
          <div style={styles.videIcone}>👨‍🏫</div>
          <p style={styles.videText}>Aucun professeur inscrit pour l'instant.</p>
        </div>
      ) : (
        <div style={styles.liste}>
          {profs.map(prof => (
            <div key={prof.id} style={{
              ...styles.card,
              ...(prof.bloque ? styles.cardBloque : {})
            }}>
              <div style={styles.cardGauche}>
                <div style={{
                  ...styles.avatar,
                  backgroundColor: prof.bloque ? '#fee2e2' : prof.enligne ? '#dcfce7' : '#ede9ff',
                  color: prof.bloque ? '#ef4444' : prof.enligne ? '#22c55e' : '#5b4fff',
                }}>
                  {prof.prenom?.charAt(0)}{prof.nom?.charAt(0)}
                </div>
                <div>
                  <div style={styles.profNom}>
                    {prof.prenom} {prof.nom}
                    {prof.enligne && <span style={styles.enligneBadge}>● En ligne</span>}
                    {prof.bloque && <span style={styles.bloqueBadge}>⛔ Bloqué</span>}
                  </div>
                  <p style={styles.profEmail}>{prof.email}</p>
                  <p style={styles.profInfo}>
                    📚 {prof.matiere} · 🏫 {prof.etablissement}
                  </p>
                  <p style={styles.profClasses}>
                    Classes : {nomClasses(prof.classesGerees)}
                  </p>
                  {prof.derniereConnexion && (
                    <p style={styles.profDate}>
                      Dernière connexion : {new Date(prof.derniereConnexion).toLocaleString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>

              <button
                style={{
                  ...styles.btnAction,
                  ...(prof.bloque ? styles.btnDebloquer : styles.btnBloquer)
                }}
                onClick={() => toggleBloquer(prof)}
              >
                {prof.bloque ? '✅ Débloquer' : '⛔ Bloquer'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '0.5rem 0' },
  chargement: {
    textAlign: 'center',
    padding: '4rem',
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  titre: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1a1535',
    letterSpacing: '-0.5px',
  },
  sous: {
    color: '#8b87a8',
    fontSize: '0.9rem',
    marginTop: '2px',
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statVal: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#22c55e',
    fontFamily: "'Outfit', sans-serif",
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#8b87a8',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  liste: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.2rem 1.5rem',
    boxShadow: '0 2px 8px rgba(91,79,255,0.08)',
    border: '1px solid #e8e5ff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  cardBloque: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca',
    opacity: 0.85,
  },
  cardGauche: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem',
    fontFamily: "'Outfit', sans-serif",
    flexShrink: 0,
  },
  profNom: {
    fontWeight: 700,
    color: '#1a1535',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  enligneBadge: {
    color: '#22c55e',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  bloqueBadge: {
    color: '#ef4444',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  profEmail: {
    color: '#8b87a8',
    fontSize: '0.85rem',
    margin: '0.2rem 0',
  },
  profInfo: {
    color: '#5b4fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    margin: '0.2rem 0',
  },
  profClasses: {
    color: '#555',
    fontSize: '0.82rem',
    margin: '0.2rem 0',
  },
  profDate: {
    color: '#aaa',
    fontSize: '0.78rem',
    marginTop: '0.2rem',
  },
  btnAction: {
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.85rem',
    fontFamily: "'Outfit', sans-serif",
    whiteSpace: 'nowrap',
  },
  btnBloquer: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
  },
  btnDebloquer: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  vide: {
    textAlign: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '2px dashed #e8e5ff',
  },
  videIcone: { fontSize: '3rem', marginBottom: '1rem' },
  videText: { color: '#8b87a8' },
}

export default AdminProfs