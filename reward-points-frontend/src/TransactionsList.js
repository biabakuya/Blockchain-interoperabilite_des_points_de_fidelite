import React from 'react';

function TransactionsList({ transactions }) {
  return (
    <div>
      <h2>Liste des Transactions</h2>
      {transactions.length > 0 ? (
        transactions.map(transaction => (
          <div key={transaction.id}>
            <p>Transaction ID: {transaction.id}</p>
            <p>Expéditeur ID: {transaction.sender_id}</p>
            <p>Destinataire ID: {transaction.receiver_id}</p>
            <p>Montant: {transaction.amount}</p>
            <p>Date: {new Date(transaction.timestamp).toLocaleString()}</p>
            <p>Hash: {transaction.hash_transaction || 'Aucun hash disponible'}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>Aucune transaction disponible.</p>
      )}
    </div>
  );
}

export default TransactionsList;
