import pymongo
import pandas as pd

# Conectar ao MongoDB
client = pymongo.MongoClient("mongodb://admin:admin@localhost:27017/")
db = client['db']

farmaceuticos_collection = db['farmaceuticos']
medicos_collection = db['medicos']
medicamentos_collection = db['medicamentos']
posto_collection = db["postos"]

farmaceuticos = list(farmaceuticos_collection.aggregate([{"$sample": {"size": 1}}]))
medicos = list(medicos_collection.aggregate([{"$sample": {"size": 1}}]))
medicamentos = list(medicamentos_collection.aggregate([{"$sample": {"size": 10}}]))

medicamentos_to_insert = []
for medicamento in medicamentos:
    med = {
        "medicamento": medicamento["_id"],
        "quantidade": 10
    }
    medicamentos_to_insert.append(med)

posto = {
    "codigo": "12345",
    "nome": "Posto de Saude 1",
    "farmaceuticos": farmaceuticos[0]["_id"],
    "medicos": medicos[0]["_id"],
    "estoque": medicamentos_to_insert
}

posto_collection.insert_one(posto)

print("Posto inserido com sucesso")
client.close()
