# gsdgrad08

## Grupo

- Pedro Henrique Conrado F. de Oliveira - 11819091
- Vítor Beneti Martins - 11877635
- Melissa Motoki Nogueira - 5588687
- Vinícius Rodrigues Ribeiro - 9779440

## Acessando a máquina virtual

Para acessar a VM do Cluster ICMC, rodar:

```linux
ssh -L 5018:localhost:5018 -L 6018:localhost:6018 -L 7018:localhost:7018 gsdgrad08@andromeda.lasdpc.icmc.usp.br -p 2118
```

Será necessário inserir a senha de autenticação. Após isso, além de estar conectado a VM, as portas 5018, 6018, 7018 de sua máquina pessoal estarão mapeadas para as portas do cluster.

## Iniciando a aplicação

Antes de iniciar, é necessário clonar o presente repositório

```
git clone ${repo}
```

Após clonar, é necessário checkar se o _Docker_ e _Node_ estão instalados.

```
docker --version
```

```
node --version
```

Obs: para alguns módulos, é necessário a versão mais recente do node (v22.2.0).

Agora, é necessário navegar entre as instâncias do NodeJS e instalar as dependências.

Para os passos, parta sempre do diretório inicial do projeto.

**Consumer**

```linux
cd consumer/
yarn install
```

**Producer**

```linux
cd producer/
yarn install
```

**Frontend**

```linux
cd frontend/
yarn install
```

Isso pode demorar algum tempo, pois necessita baixar todos os módulos.

Agora, será necessário rodar os _Containers_ do Docker. Para isso, vá até o diretório inicial e execute o comando:

```linux
make up
```

Isso irá rodar o arquivo _docker-compose.yml_, subindo todos os containers necessários, já configurados com as devidas portas.

Caso queira verificar todas as instâncias que estão rodando:

```linux
docker ps
```

Caso queira verificar os logs de um container:

```linux
docker logs -f "nome_do_container"
```

Se tudo estiver de acordo, agora tudo o que é necessário está rodando.

## Acessando o Frontend

Para acessar o frontend da aplicação, basta entrar em algum navegador (recomendado é o Google Chrome) e acessar o endereço "localhost:5018".

Agora, você poderá ter acesso ao frontend, porém não há dados inseridos no Database MongoDB **ainda**.

## Inserindo alguns dados

### Preparação

Instalar python3:

```linux
sudo apt install python3
```

Instalar pip:

```linux
sudo apt install python3-pip
```

Instalar dependências:

```linux
pip install pymongo
pip install pandas
pip install faker
```

### Rodando Scritps para popular o Database

Na pasta

```linux
--|consumer
    |--database
```

Você encontrará dois arquivos: "generate_db.py" e "import_df.py" Será necessário rodá-los por meio dos comandos:

```linux
python3 import_df.py
```

```linux
python3 generate_db.py
```

## Voltando ao Frontend

Agora, basta recarregar a página "localhost:5018/medico" para visualizar os dados do banco de dados.
