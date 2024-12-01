from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_apscheduler import APScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone
import hashlib
import os
from blockchain_integration import add_hash_to_blockchain, get_hash_from_blockchain


# Initialisation de l'application Flask
tpeApp = Flask(__name__)

# Configuration CORS
CORS(tpeApp, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configuration de la base de données PostgreSQL (avec gestion des variables d'environnement)
tpeApp.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'postgresql://postgres:Lbia270k@localhost/echanges')
tpeApp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(tpeApp)
migrate = Migrate(tpeApp, db)

# Modèle pour la table des utilisateurs
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    points = db.Column(db.Integer, default=0)
    conversion_rate = db.Column(db.Float, nullable=False, default=1.0)
    entreprise_id = db.Column(db.Integer, db.ForeignKey('entreprise.id'), nullable=True)
    entreprise = db.relationship('Entreprise', backref='users')

    def __repr__(self):
        return f'<User {self.name}>'

# Modèle pour la table des entreprises
class Entreprise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom_entreprise = db.Column(db.String(50), nullable=False)
    taux_conversion = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Entreprise {self.nom_entreprise}>'

# Modèle pour la table des transactions
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    blockchain = db.relationship('Blockchain', backref='transaction', lazy=True)

    def __repr__(self):
        return f'<Transaction {self.id}: {self.sender_id} -> {self.receiver_id}, {self.amount} points>'

# Modèle pour la table Blockchain
class Blockchain(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_transaction = db.Column(db.Integer, db.ForeignKey('transaction.id'), nullable=True)  # Autorise NULL
    hash_transaction = db.Column(db.String(256), nullable=False)
    date_enregistrement = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Blockchain {self.id}: Hash {self.hash_transaction}>'

# Fonction utilitaire de hachage global
def generate_global_hash():
    users = User.query.all()
    entreprises = Entreprise.query.all()
    transactions = Transaction.query.all()

    data_string = (
        "".join([f"{user.id}{user.name}{user.email}{user.points}" for user in users]) +
        "".join([f"{entreprise.id}{entreprise.nom_entreprise}{entreprise.taux_conversion}" for entreprise in entreprises]) +
        "".join([f"{transaction.id}{transaction.sender_id}{transaction.receiver_id}{transaction.amount}{transaction.timestamp}" for transaction in transactions])
    )

    hash_value = hashlib.sha256(data_string.encode()).hexdigest()
    new_blockchain_entry = Blockchain(id_transaction=None, hash_transaction=hash_value)
    db.session.add(new_blockchain_entry)
    db.session.commit()

    return hash_value

# Route pour ajouter un utilisateur
@tpeApp.route('/add_user', methods=['POST'])
def add_user():

    """
    Ajoute un utilisateur et envoie un hash localement et à la blockchain.
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    entreprise_id = data.get('entreprise_id')

    if not name or not email:
        return jsonify({"error": "Veuillez fournir un nom et un email"}), 400

    entreprise = db.session.get(Entreprise, entreprise_id)
    if not entreprise:
        return jsonify({"error": "L'entreprise n'existe pas"}), 400

    new_user = User(name=name, email=email, entreprise_id=entreprise_id, conversion_rate=1.0)
    db.session.add(new_user)
    db.session.commit()

    # Capturer l'ID de l'utilisateur avant de fermer la session
    user_id = new_user.id

    return jsonify({"message": f"Utilisateur {name} ajouté avec succès", "id": user_id}), 201


# Route pour ajouter une entreprise
@tpeApp.route('/add_entreprise', methods=['POST'])
def add_entreprise():
    data = request.get_json()
    nom_entreprise = data.get('nom_entreprise')
    taux_conversion = data.get('taux_conversion')

    if not nom_entreprise or not taux_conversion:
        return jsonify({"error": "Veuillez fournir un nom et un taux de conversion"}), 400

    if Entreprise.query.filter_by(nom_entreprise=nom_entreprise).first():
        return jsonify({"error": "Le nom de l'entreprise existe déjà"}), 400

    new_entreprise = Entreprise(nom_entreprise=nom_entreprise, taux_conversion=taux_conversion)
    db.session.add(new_entreprise)
    db.session.commit()

    return jsonify({"message": f"Entreprise {nom_entreprise} ajoutée avec succès", "id": new_entreprise.id}), 201

# Route pour transférer des points avec génération de hash
@tpeApp.route('/transfer_points', methods=['POST'])
def transfer_points():
    """
      Transfère des points entre utilisateurs et enregistre un hash de la transaction
      dans la blockchain.
    """

    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    amount = data.get('amount')

    if not sender_id or not receiver_id or not amount:
        return jsonify({"error": "Données de transfert incomplètes"}), 400 

    sender = User.query.get_or_404(sender_id)
    receiver = User.query.get_or_404(receiver_id)

    if sender.points < amount:
      return jsonify({"error": "Solde insuffisant"}), 400
  
    # Mise à jour des points des utilisateurs
    sender.points -= amount
    receiver.points += amount

# Enregistrement de la transaction
    transaction = Transaction(sender_id=sender.id, receiver_id=receiver.id, amount=amount)
    db.session.add(transaction)
    db.session.commit()

  # Génération du hash pour la transaction
    hash_data = f"{transaction.id}{transaction.sender_id}{transaction.receiver_id}{transaction.amount}{transaction.timestamp}"
    hash_value = hashlib.sha256(hash_data.encode()).hexdigest()

    # Envoi automatique du hash à la blockchain
    try:
        blockchain_hash = add_hash_to_blockchain(hash_value)

        # Enregistrement dans la table Blockchain
        blockchain_entry = Blockchain(
            id_transaction=transaction.id,
            hash_transaction=blockchain_hash
        )
        db.session.add(blockchain_entry)
        db.session.commit()
        return jsonify({
            "message": "Transfert réussi",
            "transaction_id": transaction.id,
            "hash_local": hash_value,
            "blockchain_hash": blockchain_hash
        }), 200
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout du hash à la blockchain : {str(e)}"}), 500

# Routes pour récupérer les données
@tpeApp.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([{
        "id": transaction.id,
        "sender_id": transaction.sender_id,
        "receiver_id": transaction.receiver_id,
        "amount": transaction.amount,
        "timestamp": transaction.timestamp,
        "hash_transaction": transaction.blockchain[0].hash_transaction if transaction.blockchain else None
    } for transaction in transactions])

@tpeApp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "points": user.points,
        "entreprise": user.entreprise.nom_entreprise if user.entreprise else "Aucune"
    } for user in users])

@tpeApp.route('/entreprises', methods=['GET'])
def get_entreprises():
    entreprises = Entreprise.query.all()
    return jsonify([{
        "id": entreprise.id,
        "nom_entreprise": entreprise.nom_entreprise,
        "taux_conversion": entreprise.taux_conversion
    } for entreprise in entreprises])

@tpeApp.route('/routes', methods=['GET'])
def get_routes():
    return jsonify({rule.rule: list(rule.methods) for rule in tpeApp.url_map.iter_rules()})

# Routes API
@tpeApp.route('/blockchain/add_hash', methods=['POST'])
def add_hash_route():
    data = request.get_json()
    transaction_hash = data.get('transaction_id')
    hash_to_add = data.get('hash')

    if not data or 'transaction_id' not in data or 'hash' not in data:
        return jsonify({"error": "transaction_id et hash sont requis"}), 400
    transaction_id = data['transaction_id']
    hash_to_add = data['hash']

        # Appeler votre fonction pour ajouter le hash
    result = add_hash_to_blockchain(hash_to_add)


    try:
        #ajout du hash sur la blockchain
        blockchain_hash = add_hash_to_blockchain(hash_to_add)

        # Enregistrer le hash dans la table Blockchain
        new_blockchain_entry = Blockchain(
            id_transaction=transaction_id,
            hash_transaction=blockchain_hash
        )
        db.session.add(new_blockchain_entry)
        db.session.commit()
        
        #tx_hash = add_hash_to_blockchain(transaction_hash)
        return jsonify({"message": "Hash ajouté avec succès", "blockchain_hash": blockchain_hash}), 201
    
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'ajout du hash : {str(e)}"}), 500



@tpeApp.route('/blockchain/get_hash/<int:id>', methods=['GET'])
def get_hash_route(id):
    try:
        hash_value = get_hash_from_blockchain(id)
        return jsonify({"id": id, "hash": hash_value})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Configuration et démarrage du planificateur
class Config:
    SCHEDULER_API_ENABLED = True

tpeApp.config.from_object(Config())
scheduler = APScheduler(BackgroundScheduler())
scheduler.init_app(tpeApp)

# Tâche périodique
@scheduler.task('interval', id='global_hash_task', seconds=300)  # Toutes les 300 secondes
def scheduled_generate_hash():
    """
    Génère un hash global de l'état actuel des utilisateurs, entreprises et transactions,
    puis l'envoie automatiquement à la blockchain.
    """
    with tpeApp.app_context():
        hash_value = generate_global_hash()
        print(f"Hash global généré : {hash_value} à {datetime.now(timezone.utc)}")

        try:
            # Envoi du hash global à la blockchain
            blockchain_hash = add_hash_to_blockchain(hash_value)

            # Enregistrement dans la table Blockchain
            blockchain_entry = Blockchain(
                id_transaction=None,
                hash_transaction=blockchain_hash
            )
            db.session.add(blockchain_entry)
            db.session.commit()

            print(f"Hash global enregistré et envoyé à la blockchain : {blockchain_hash}")
        except Exception as e:
            print(f"Erreur lors de l'envoi du hash global à la blockchain : {str(e)}")


scheduler.start()

# Route pour afficher la Blockchain
@tpeApp.route('/blockchain', methods=['GET'])
def get_blockchain_entries():
    blockchain_entries = Blockchain.query.order_by(Blockchain.date_enregistrement.desc()).all()
    return jsonify([{
        "id": entry.id,
        "hash": entry.hash_transaction,
        "date": entry.date_enregistrement
    } for entry in blockchain_entries])

@tpeApp.route('/blockchain/transaction_details/<tx_hash>', methods=['GET'])
def get_transaction_details_route(tx_hash):
    try:
        details = get_transaction_details(tx_hash)
        return jsonify({'status': 'success', 'transaction_details': details}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    tpeApp.run(debug=True)
