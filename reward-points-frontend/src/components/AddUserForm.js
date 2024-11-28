import React, { useState } from 'react';

function AddUserForm({ entreprises, fetchUsers }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [entrepriseId, setEntrepriseId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      entreprise_id: entrepriseId,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/add_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        fetchUsers(); // Met à jour la liste des utilisateurs
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Erreur lors de l\'ajout de l\'utilisateur.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter un utilisateur</h2>
      <label>
        Nom:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <label>
        Entreprise:
        <select value={entrepriseId} onChange={(e) => setEntrepriseId(e.target.value)} required>
          <option value="">Sélectionner une entreprise</option>
          {entreprises.map((entreprise) => (
            <option key={entreprise.id} value={entreprise.id}>
              {entreprise.nom_entreprise}
            </option>
          ))}
        </select>
      </label>
      <br />
      <button type="submit">Ajouter</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default AddUserForm;
