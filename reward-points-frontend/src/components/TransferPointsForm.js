import React, { useState } from 'react';

function TransferPointsForm({ users }) {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      sender_id: senderId,
      receiver_id: receiverId,
      amount: parseInt(amount),
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/transfer_points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Erreur lors du transfert des points.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Transférer des points</h2>
      <label>
        Expéditeur:
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
        Destinataire:
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
        Montant:
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Envoyer</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default TransferPointsForm;
<form className="form-group">
  <label>Nom :</label>
  <input type="text" className="form-control" />
  <button type="submit" className="btn btn-primary mt-2">Envoyer</button>
</form>
