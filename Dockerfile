FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .env .env

RUN npm install

RUN npm install express dotenv cors

RUN npm install -g http-server

COPY . .

EXPOSE 8080
EXPOSE 3000

CMD ["sh", "-c", "node backend/server.js & http-server -p 8080"]