// pages/signup.js
import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
        setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="container">
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        /><br />

        <button className="button" type="submit">S'inscrire</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}

      <p style={{ marginTop: '1rem' }}>
        Vous avez déjà un compte ? <Link href="/login">Connectez-vous</Link>
      </p>
    </div>
  );
}
