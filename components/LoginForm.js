import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Bienvenue, ${data.user.name || data.user.email} !`);
      setTimeout(() => {
        router.push('/HomePage');
      }, 1000);
    } else {
      setMessage(data.error || 'Une erreur est survenue.');
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '320px',
          maxWidth: '350px',
          width: '100%'
        }}
      >
        <img src="/logo-sage.png" alt="Logo Sage" width={70} style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Se connecter</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ marginBottom: '1.5rem', width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            className="button"
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Connexion
          </button>
        </form>
        {message && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Vous n'avez pas encore de compte ?<br />
        <Link href="/signup">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}