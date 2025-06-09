import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Connexion réussie !');
        // Redirection ou autre logique à suivre ici
      } else {
        setMessage(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container">
      <h2>Se connecter</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button className="button" type="submit">
          Se connecter
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      <p style={{ marginTop: '1rem' }}>
        Vous n'avez pas encore de compte ?{' '}
        <Link href="/signup">Créer un compte</Link>
      </p>
      <button
        className="button"
        style={{ marginTop: '1rem' }}
        onClick={() => window.location.href = '/formulaire'}
        type="button"
      >
        Créer une séquence
      </button>
      </div>
  );
}
 