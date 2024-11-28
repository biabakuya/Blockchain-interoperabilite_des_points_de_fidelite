import React, { useState } from 'react';

function AddEntrepriseForm({ fetchEntreprises }) {
  const [name, setName] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nom_entreprise: name, taux_conversion: parseFloat(conversionRate) };

    try {
      const response = await fetch('http://127.0.0.1:5000/add_entreprise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        fetchEntreprises(); // Actualiser la liste des entreprises
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Erreur lors de l\'ajout de l\'entreprise.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ajouter une entreprise</h2>
      <label>
        Nom de l'entreprise :
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <br />
      <label>
        Taux de conversion :
        <input type="number" step="0.01" value={conversionRate} onChange={(e) => setConversionRate(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Ajouter</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default AddEntrepriseForm;
