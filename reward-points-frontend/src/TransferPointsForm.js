import React, { useState } from 'react';

function TransferPointsForm({ users, entreprises }) {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { sender_id: senderId, receiver_id: receiverId, amount: parseInt(amount) };

    const response = await fetch('http://127.0.0.1:5000/transfer_points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transférer des points</h2>
      <label>
        ID de l'utilisateur expéditeur:
        <select value={senderId} onChange={(e) => setSenderId(e.target.value)} required>
          <option value="">Sélectionner un utilisateur</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        ID de l'utilisateur destinataire:
        <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
          <option value="">Sélectionner un utilisateur</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Montant à envoyer:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default TransferPointsForm;
