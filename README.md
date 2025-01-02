# Blockchain et Gestion des Points de Fidélité

Ce projet propose une solution basée sur la blockchain pour résoudre les limitations des systèmes de gestion de points de fidélité traditionnels. Il permet une interopérabilité entre différents réseaux commerciaux, garantissant transparence, sécurité et flexibilité.


## Contexte

Dans un contexte commercial compétitif, les systèmes de points de fidélité traditionnels souffrent de limitations comme le manque d'interopérabilité, une gestion centralisée, et des coûts élevés. Ce projet utilise la blockchain pour créer un système d'échanges de points entre différents réseaux commerciaux, tout en renforçant la transparence et la confiance.

## Fonctionnalités Clés

- **Interopérabilité** : Échange de points entre différents programmes de fidélité.
- **Sécurité** : Transactions immuables et transparentes grâce à la blockchain Ethereum.
- **Flexibilité** : Gestion des points via une interface intuitive.
- **Automatisation** : Utilisation de smart contracts pour valider et exécuter les transactions.

## Technologies Utilisées

- **Blockchain** : Ethereum (Testnet Sepolia)
- **Smart Contracts** : Solidity
- **Backend** : Flask (Python)
- **Base de Données** : PostgreSQL
- **Frontend** : React.js
- **Authentification** : MetaMask
- **Conteneurisation** : Docker

## Architecture

L'architecture repose sur une combinaison de blockchain, de backend REST et d'un frontend interactif. Les principaux composants sont :

- **Frontend React** : Interface utilisateur intuitive.
- **Backend Flask** : Orchestration des transactions et gestion des données.
- **Smart Contracts** : Automatisation des échanges de points.
- **Blockchain** : Enregistrement immuable et transparent des transactions.

## Mise en Place

### Prérequis

- Node.js
- Python 3.8
- Docker
- MetaMask configuré pour le testnet Sepolia

### Installation

1. Clonez le répertoire :
   ```bash
   git clone https://github.com/biabakuya/Blockchain-interoperabilite_des_points_de_fidelite.git
   cd Blockchain-interoperabilite_des_points_de_fidelite
   ```

2. Lancez les conteneurs Docker :
   ```bash
   docker-compose up
   ```

3. Accédez au frontend sur `http://localhost:3000` et connectez-vous avec MetaMask.

## Cas d'Utilisation

- **Transfert de Points** : Un utilisateur peut envoyer des points à un autre utilisateur via la blockchain.
- **Conversion de Points** : Conversion entre différents programmes de fidélité avec des taux prédéfinis.
- **Consultation des Transactions** : Les utilisateurs et entreprises peuvent suivre l'historique des transactions.

## Contributions

Les contributions sont les bienvenues ! Veuillez soumettre vos suggestions via des issues ou pull requests.


