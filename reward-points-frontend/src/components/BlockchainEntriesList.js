import React, { useEffect, useState } from 'react';

function BlockchainEntriesList() {
  const [blockchainEntries, setBlockchainEntries] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/blockchain')
      .then(response => response.json())
      .then(data => setBlockchainEntries(data))
      .catch(error => console.error('Erreur lors de la récupération des entrées blockchain:', error));
  }, []);

  return (
    <div>
      <h2>Entrées Blockchain</h2>
      {blockchainEntries.length > 0 ? (
        blockchainEntries.map(entry => (
          <div key={entry.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <p>ID : {entry.id}</p>
            <p>Hash : {entry.hash}</p>
            <p>
              Voir sur Etherscan :{' '}
              <a
                href={`https://sepolia.etherscan.io/tx/${entry.hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.hash}
              </a>
            </p>
            <p>Date : {new Date(entry.date).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>Aucune entrée blockchain trouvée.</p>
      )}
    </div>
  );
}

export default BlockchainEntriesList;
