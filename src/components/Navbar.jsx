function Navbar({ titre, page, onRetour }) {
  const estAccueil = page === 'classes';

  return (
    <nav style={styles.nav}>
      <div style={styles.gauche}>
        {!estAccueil && (
          <button style={styles.btnRetour} onClick={onRetour}>
            ←
          </button>
        )}
        <div>
          {estAccueil && <span style={styles.appName}>Samju43</span>}
          <h1 style={estAccueil ? styles.titreAccueil : styles.titrePage}>
            {titre}
          </h1>
        </div>
      </div>

      <div style={styles.badge}>
        <span style={styles.badgeDot}></span>
        En ligne
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #5b4fff 0%, #8b5cf6 100%)',
    padding: '1.1rem 2.5rem',
    boxShadow: '0 4px 20px rgba(91,79,255,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  gauche: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  btnRetour: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.3)',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    flexShrink: 0,
  },
  appName: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.75rem',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '2px',
  },
  titreAccueil: {
    color: 'white',
    fontSize: '1.5rem',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 800,
    letterSpacing: '-0.3px',
  },
  titrePage: {
    color: 'white',
    fontSize: '1.2rem',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700,
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '99px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  badgeDot: {
    width: '7px',
    height: '7px',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 0 6px #22c55e',
  }
};

export default Navbar;