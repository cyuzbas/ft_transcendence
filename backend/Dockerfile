FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install --silent
RUN npm install --silent -g @nestjs/cli
RUN npm install 
RUN npm install -g @nestjs/cors

CMD ["npm", "run", "start:dev"]