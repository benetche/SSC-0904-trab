include .env

.PHONY: up

up:
	sudo docker compose up -d

.PHONY: down

down:
	sudo docker compose down

.PHONY: logs

logs:
	sudo docker compose logs -f

.PHONY: connect

connect:
	sshpass -p 5abWIkSB ssh gsdgrad08@andromeda.lasdpc.icmc.usp.br -p 2118

.PHONY: ports

ports:
	sshpass -p 5abWIkSB ssh -L 5018:localhost:5018 -L 6018:localhost:6018 -L 7018:localhost:7018 gsdgrad08@andromeda.lasdpc.icmc.usp.br -p 2118