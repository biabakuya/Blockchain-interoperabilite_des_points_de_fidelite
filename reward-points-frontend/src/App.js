import React, { useState, useEffect } from 'react';
import TransferPointsForm from './components/TransferPointsForm';
import AddUserForm from './components/AddUserForm';
import AddEntrepriseForm from './components/AddEntrepriseForm';
import TransactionsList from './components/TransactionsList';
import UsersList from './components/UsersList';
import EntreprisesList from './components/EntreprisesList';
import BlockchainEntriesList from './components/BlockchainEntriesList';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentView, setCurrentView] = useState('transfer'); // Vue par défaut
  const [message, setMessage] = useState('');

  // Fetch data for users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setMessage('Erreur lors du chargement des utilisateurs.');
    }
  };

  // Fetch data for entreprises
  const fetchEntreprises = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/entreprises');
      const data = await response.json();
      setEntreprises(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error);
      setMessage('Erreur lors du chargement des entreprises.');
    }
  };

  // Fetch data for transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setMessage('Erreur lors du chargement des transactions.');
    }
  };

  // Fetch all data on initial render
  useEffect(() => {
    fetchUsers();
    fetchEntreprises();
    fetchTransactions();
  }, []);

  return (
    <div className="App">
      <header className="bg-primary text-white py-3">
        <div className="container">
          <h1 className="text-center">Échangeur de Points</h1>
        </div>
      </header>
      <nav className="bg-light py-2">
        <div className="container d-flex flex-wrap justify-content-center gap-3">
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('transfer')}>Transférer des Points</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('addUser')}>Ajouter un Utilisateur</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('addEntreprise')}>Ajouter une Entreprise</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('transactions')}>Voir les Transactions</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('users')}>Voir les Utilisateurs</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('entreprises')}>Voir les Entreprises</button>
          <button className="btn btn-outline-primary" onClick={() => setCurrentView('blockchain')}>Voir la Blockchain</button>
        </div>
      </nav>
      <main className="container mt-4">
        {message && <p className="alert alert-danger">{message}</p>}
        <div className="content">
          {currentView === 'transfer' && <TransferPointsForm users={users} />}
          {currentView === 'addUser' && <AddUserForm entreprises={entreprises} fetchUsers={fetchUsers} />}
          {currentView === 'addEntreprise' && <AddEntrepriseForm fetchEntreprises={fetchEntreprises} />}
          {currentView === 'transactions' && <TransactionsList transactions={transactions} />}
          {currentView === 'users' && <UsersList users={users} />}
          {currentView === 'entreprises' && <EntreprisesList entreprises={entreprises} />}
          {currentView === 'blockchain' && <BlockchainEntriesList />}
        </div>
      </main>
      <footer className="bg-dark text-white text-center py-3 mt-4">
        <p>&copy; 2024 Échangeur de Points. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
