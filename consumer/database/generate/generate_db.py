import pymongo
from faker import Faker
import random

client = pymongo.MongoClient("mongodb://admin:admin@localhost:27017/")
db = client['db']

pacientes = db['pacientes']
medicos = db['medicos']
farmaceuticos = db['farmaceuticos']

fake = Faker('pt_BR')

def gerar_paciente():
    return {
        'cpf': fake.cpf().replace("-", "").replace(".", ""),
        'nome': fake.name(),
        'endereco': fake.address(),
        'idade': random.randint(0, 65)
    }

def gerar_medico():
    return {
        'cpf': fake.cpf().replace("-", "").replace(".", ""),
        'nome': fake.name(),
        'crm': fake.unique.bothify(text='######')  # Gera um CRM fictício
    }

def gerar_farmaceutico():
    return {
        'cpf': fake.cpf().replace("-", "").replace(".", ""),
        'nome': fake.name(),
        'crf': fake.unique.bothify(text='######')  # Gera um CRF fictício
    }


numero_de_pacientes = 10  # Defina o número de pacientes a serem gerados
numero_de_medicos = 5  # Defina o número de médicos a serem gerados
numero_de_farmaceuticos = 3

pacientes_to_create = [gerar_paciente() for _ in range(numero_de_pacientes)]
pacientes_to_create.append({'cpf': "39049495869", 'nome': fake.name(),
        'endereco': fake.address(),
        'idade': random.randint(0, 65) })
pacientes.insert_many(pacientes_to_create)

medicos_to_create = [gerar_medico() for _ in range(numero_de_medicos)]
medicos.insert_many(medicos_to_create)

farmaceuticos_to_create = [gerar_farmaceutico() for _ in range(numero_de_farmaceuticos)]
farmaceuticos.insert_many(farmaceuticos_to_create)


print("dados inseridos com sucesso")

client.close()
