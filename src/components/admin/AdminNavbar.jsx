function AdminNavbar({ page, onPage, onDeconnecter, profsEnLigne }) {
  const navItems = [
    { id: 'classes', label: '🏫 Classes' },
    { id: 'etudiants', label: '👥 Étudiants' },
    { id: 'profs', label: '👨‍🏫 Professeurs' },
  ]

  return (
    <nav style={styles.nav}>
      <div style={styles.gauche}>
        <span style={styles.logo}>🎓</span>
        <span style={styles.appName}>Samju43</span>
        <span style={styles.adminBadge}>ADMIN</span>
      </div>

      <div style={styles.centre}>
        {navItems.map(item => (
          <button
            key={item.id}
            style={{
              ...styles.navBtn,
              ...(page === item.id ? styles.navBtnActif : {})
            }}
            onClick={() => onPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={styles.droite}>
        <div style={styles.enligneBadge}>
          <span style={styles.dot}></span>
          {profsEnLigne} en ligne
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
    background: 'linear-gradient(135deg, #1a1535 0%, #2d1b69 100%)',
    padding: '1rem 2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
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
  },
  adminBadge: {
    backgroundColor: '#f59e0b',
    color: '#1a1535',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '1px',
  },
  centre: {
    display: 'flex',
    gap: '0.5rem',
  },
  navBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s',
  },
  navBtnActif: {
    backgroundColor: '#5b4fff',
    color: 'white',
    boxShadow: '0 4px 12px rgba(91,79,255,0.4)',
  },
  droite: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  enligneBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.85rem',
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    boxShadow: '0 0 8px #22c55e',
    display: 'inline-block',
  },
  btnDeconnexion: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.85rem',
    fontFamily: "'Outfit', sans-serif",
  },
}

export default AdminNavbar