from web3 import Web3
import os
import certifi
#from datetime import datetime
#from database import BlockchainHash, db  # Importation des modèles et de la base de données (si définis)

# Configuration pour le certificat SSL
os.environ['SSL_CERT_FILE'] = "C:\\certs\\cacert.pem"

# Connexion au réseau Sepolia via Infura
infura_url = "https://sepolia.infura.io/v3/97124eec138b4732acb8cd2e93b08c86"
web3 = Web3(Web3.HTTPProvider(infura_url, request_kwargs={'verify': certifi.where()}))

# Vérification de la connexion
if web3.is_connected():
    print("Connecté au réseau Sepolia Testnet")
else:
    raise ConnectionError("Échec de la connexion au réseau Sepolia Testnet")

# Adresse et ABI du contrat déployé
contract_address = "0xd9145CCE52D386f254917e481eB44e9943F39138"
contract_abi = [
    {
        "inputs": [{"internalType": "string", "name": "_hash", "type": "string"}],
        "name": "addTransactionHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
        "name": "getTransactionHash",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
    }
]
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Informations du compte MetaMask
account = "0x58497E44A3FaE35B024989c0eBa27aF3a365B9D7"
private_key = "e77873bde71f1102358ed9070c3faec36f210dd851c1397e5e3f6059b0b6a337"


# Fonction pour ajouter un hash à la blockchain
def add_hash_to_blockchain(transaction_hash):
    try:
        print("Récupération du nonce...")
        nonce = web3.eth.get_transaction_count(account, 'pending')  # Utilisation du nonce 'pending'
        print(f"Nonce : {nonce}")

        print("Estimation du gas...")
        gas_estimation = contract.functions.addTransactionHash(transaction_hash).estimate_gas({
            'from': account
        })
        print(f"Gas estimé : {gas_estimation}")

        print("Construction de la transaction...")
        current_gas_price = web3.eth.gas_price
        tx = contract.functions.addTransactionHash(transaction_hash).build_transaction({
            'chainId': 11155111,  # Sepolia Testnet ID
            'gas': gas_estimation,
            'gasPrice': current_gas_price + web3.to_wei('1', 'gwei'),
            'nonce': nonce
        })
        print(f"Transaction : {tx}")

        print("Signature de la transaction...")
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)

        print("Envoi de la transaction...")
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        print(f"Transaction envoyée avec le hash : {web3.to_hex(tx_hash)}")
        return web3.to_hex(tx_hash)

    except Exception as e:
        print(f"Erreur pendant l'ajout du hash : {str(e)}")
        raise Exception(f"Erreur lors de l'ajout du hash : {str(e)}")


# Fonction pour récupérer les détails d'une transaction
def get_transaction_details(tx_hash):
    try:
        tx_receipt = web3.eth.get_transaction_receipt(tx_hash)
        print(f"Détails de la transaction : {tx_receipt}")
        return tx_receipt
    except Exception as e:
        print(f"Erreur lors de la récupération des détails de la transaction : {str(e)}")
        raise Exception(f"Erreur lors de la récupération des détails de la transaction : {str(e)}")


# Fonction pour récupérer un hash depuis la blockchain
def get_hash_from_blockchain(transaction_id):
    try:
        return contract.functions.getTransactionHash(transaction_id).call()
    except Exception as e:
        raise Exception(f"Erreur lors de la récupération du hash : {str(e)}")


# Fonction pour enregistrer localement et envoyer un hash à la blockchain
def save_and_send_hash_to_blockchain(hash_to_add):
    """
    Enregistre un hash localement et l'envoie à la blockchain.
    """
    try:
        # Enregistrement local dans la base de données
        new_hash_entry = BlockchainHash(hash=hash_to_add, date=datetime.utcnow())
        db.session.add(new_hash_entry)
        db.session.commit()
        print(f"Hash {hash_to_add} enregistré dans la base de données locale.")

        # Envoi vers la blockchain
        tx_hash = add_hash_to_blockchain(hash_to_add)
        print(f"Hash {hash_to_add} envoyé à la blockchain avec le hash de transaction {tx_hash}.")

        return {"status": "success", "local_hash": hash_to_add, "blockchain_tx_hash": tx_hash}
    except Exception as e:
        print(f"Erreur lors de l'enregistrement ou de l'envoi du hash : {str(e)}")
        return {"status": "error", "message": str(e)}
