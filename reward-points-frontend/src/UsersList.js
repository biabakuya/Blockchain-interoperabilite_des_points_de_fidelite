import React from 'react';

function UsersList({ users }) {
  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name} ({user.email}) - Solde: {user.points} points</p>
        </div>
      ))}
    </div>
  );
}

export default UsersList;
