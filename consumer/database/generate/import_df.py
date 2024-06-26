import pymongo
import pandas as pd

# Conectar ao MongoDB
client = pymongo.MongoClient("mongodb://admin:admin@localhost:27017/")
db = client['db']
collection = db['medicamentos']

# Ler o CSV ignorando o cabeçalho
pmc = pd.read_csv("./df_sus.csv", skiprows=1, names=["substancia", "codigo", "preco"], header=None)
pmc['preco'] = pmc['preco'].astype(float)
pmc['codigo'] = pmc['codigo'].astype(str)

# Converter o DataFrame para um dicionário
di = pmc.to_dict(orient='records')

# Inserir os dados na coleção do MongoDB
collection.insert_many(di)

# Verificar a quantidade de documentos na coleção
dados = list(collection.find({}))
print(len(dados))

# Fechar a conexão com o MongoDB
client.close()

