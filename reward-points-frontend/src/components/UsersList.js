import React from 'react';

function UsersList({ users }) {
  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: '10px', border: '1px solid #ddd', padding: '10px' }}>
          <p>
            <strong>Nom :</strong> {user.name} <br />
            <strong>Email :</strong> {user.email} <br />
            <strong>Solde :</strong> {user.points} points
          </p>
        </div>
      ))}
    </div>
  );
}

export default UsersList;
