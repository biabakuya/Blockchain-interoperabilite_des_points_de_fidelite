import React from 'react';

function EntreprisesList({ entreprises }) {
  return (
    <div>
      <h2>Liste des Entreprises</h2>
      {entreprises.map((entreprise) => (
        <div key={entreprise.id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <p>
            <strong>Nom :</strong> {entreprise.nom_entreprise} <br />
            <strong>Taux de Conversion :</strong> {entreprise.taux_conversion}
          </p>
        </div>
      ))}
    </div>
  );
}

export default EntreprisesList;
