import React, { useState, useEffect } from 'react';
import TransferPointsForm from './components/TransferPointsForm';
import AddUserForm from './components/AddUserForm';
import AddEntrepriseForm from './components/AddEntrepriseForm';
import TransactionsList from './components/TransactionsList';
import UsersList from './components/UsersList';
import EntreprisesList from './components/EntreprisesList';
import BlockchainEntriesList from './components/BlockchainEntriesList';
import './App.css';

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
      <h1>Échangeur de Points</h1>
      <nav>
        <button onClick={() => setCurrentView('transfer')}>Transférer des Points</button>
        <button onClick={() => setCurrentView('addUser')}>Ajouter un Utilisateur</button>
        <button onClick={() => setCurrentView('addEntreprise')}>Ajouter une Entreprise</button>
        <button onClick={() => setCurrentView('transactions')}>Voir les Transactions</button>
        <button onClick={() => setCurrentView('users')}>Voir les Utilisateurs</button>
        <button onClick={() => setCurrentView('entreprises')}>Voir les Entreprises</button>
        <button onClick={() => setCurrentView('blockchain')}>Voir la Blockchain</button>
      </nav>
      <div className="content">
         {currentView === 'blockchain' && <BlockchainEntriesList />}
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div className="content">
        {currentView === 'transfer' && <TransferPointsForm users={users} />}
        {currentView === 'addUser' && <AddUserForm entreprises={entreprises} fetchUsers={fetchUsers} />}
        {currentView === 'addEntreprise' && <AddEntrepriseForm fetchEntreprises={fetchEntreprises} />}
        {currentView === 'transactions' && <TransactionsList transactions={transactions} />}
        {currentView === 'users' && <UsersList users={users} />}
        {currentView === 'entreprises' && <EntreprisesList entreprises={entreprises} />}
        {currentView === 'blockchain' && <BlockchainEntriesList />}
      </div>
    </div>

    
  );
}

export default App;
