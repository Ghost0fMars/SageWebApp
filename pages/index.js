import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <div className="banner-container">
        <img
          src="/banniere-sage.png"
          alt="Bannière SAGE"
          className="banner-image"
        />
      </div>

      <p style={{ marginTop: '2rem' }}>
        Bienvenue dans votre assistant de classe. 
      </p>
      <p> <b>SAGE</b> est un outil de gestion de séquences pédagogiques pour les enseignants.</p> 
      <p> Il vous permet de créer, gérer et partager vos séquences avec vos collègues et vos élèves.</p>

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <Link href="/login" legacyBehavior>
          <a className="button">Se connecter</a>
        </Link>
      </div>
      
            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <Link href="/formulaire" legacyBehavior>
          <a className="button">Créer une séquence</a>
        </Link>
      </div>
     
      <p style={{ marginTop: '1rem' }}>
        Pas encore de compte ?{' '}
        <Link href="/signup" legacyBehavior>
          <a className="accent">Créer un compte</a>
        </Link>
      </p>
    </div>
  );
}
