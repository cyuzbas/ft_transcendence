name = pong

all:
	@docker-compose -f ./srcs/docker-compose.yml up -d --build

up:
	@docker-compose -f ./srcs/docker-compose.yml up
	
down:
	@docker-compose -f ./srcs/docker-compose.yml down

re:
	@docker-compose -f ./srcs/docker-compose.yml up -d --build

clean:
	@docker-compose -f ./srcs/docker-compose.yml down
	@docker system prune -af
	@docker volume rm $$(docker volume ls -q)

.PHONY	: all up down re clean