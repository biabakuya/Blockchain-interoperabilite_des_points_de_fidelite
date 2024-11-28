import React, { useState } from 'react';

function AddEntrepriseForm({ fetchEntreprises }) {
  const [name, setName] = useState('');
  const [conversionRate, setConversionRate] = useState('');

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
      alert(result.message);
      fetchEntreprises();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
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
        <input type="number" value={conversionRate} onChange={(e) => setConversionRate(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AddEntrepriseForm;
