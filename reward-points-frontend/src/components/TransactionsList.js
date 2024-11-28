import React from 'react';

function TransactionsList({ transactions }) {
  return (
    <div>
      <h2>Liste des transactions</h2>
      {transactions.map((transaction) => (
        <div key={transaction.id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <p><strong>Transaction ID :</strong> {transaction.id}</p>
          <p><strong>Expéditeur ID :</strong> {transaction.sender_id}</p>
          <p><strong>Destinataire ID :</strong> {transaction.receiver_id}</p>
          <p><strong>Montant :</strong> {transaction.amount} points</p>
          <p><strong>Date :</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default TransactionsList;
