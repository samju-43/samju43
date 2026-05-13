function ProfNavbar({ prof, onDeconnecter }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.gauche}>
        <span style={styles.logo}>🎓</span>
        <div>
          <span style={styles.appName}>Samju43</span>
          <span style={styles.profBadge}>{prof.matiere}</span>
        </div>
      </div>

      <div style={styles.droite}>
        <div style={styles.profInfo}>
          <div style={styles.avatar}>
            {prof.prenom?.charAt(0)}{prof.nom?.charAt(0)}
          </div>
          <div>
            <p style={styles.profNom}>{prof.prenom} {prof.nom}</p>
            <p style={styles.profEtab}>{prof.etablissement}</p>
          </div>
        </div>
        <button style={styles.btnDeconnexion} onClick={onDeconnecter}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 100%)',
    padding: '1rem 2rem',
    boxShadow: '0 4px 20px rgba(91,79,255,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '1rem',
  },
  gauche: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  logo: { fontSize: '1.5rem' },
  appName: {
    color: 'white',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 800,
    fontSize: '1.2rem',
    display: 'block',
  },
  profBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '0.1rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  droite: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  profInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 800,
    fontSize: '0.9rem',
    fontFamily: "'Outfit', sans-serif",
  },
  profNom: {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.9rem',
    margin: 0,
  },
  profEtab: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.75rem',
    margin: 0,
  },
  btnDeconnexion: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    fontFamily: "'Outfit', sans-serif",
  },
}

export default ProfNavbar