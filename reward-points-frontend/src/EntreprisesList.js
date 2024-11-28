import React from 'react';

function EntreprisesList({ entreprises }) {
  return (
    <div>
      <h2>Liste des Entreprises</h2>
      {entreprises.length > 0 ? (
        entreprises.map((entreprise) => (
          <div key={entreprise.id}>
            <p>{entreprise.nom_entreprise} - Taux de conversion: {entreprise.taux_conversion}</p>
          </div>
        ))
      ) : (
        <p>Aucune entreprise trouvée.</p>
      )}
    </div>
  );
}

export default EntreprisesList;
