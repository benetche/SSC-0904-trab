import pymongo
from faker import Faker
import random

client = pymongo.MongoClient("mongodb://admin:admin@localhost:27017/")
db = client['db']

collection = db['pacientes']

fake = Faker('pt_BR')

def gerar_paciente():
    return {
        'cpf': fake.cpf(),
        'nome': fake.name(),
        'endereco': fake.address(),
        'idade': random.randint(0, 65)
    }

numero_de_pacientes = 10  # Defina o número de pacientes a serem gerados

pacientes = [gerar_paciente() for _ in range(numero_de_pacientes)]
collection.insert_many(pacientes)

collection = db['medicos']

def gerar_medico():
    return {
        'cpf': fake.cpf(),
        'nome': fake.name(),
        'crm': fake.unique.bothify(text='######')  # Gera um CRM fictício
    }

numero_de_medicos = 5  # Defina o número de médicos a serem gerados

medicos = [gerar_medico() for _ in range(numero_de_medicos)]
collection.insert_many(medicos)

client.close()
