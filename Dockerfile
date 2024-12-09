FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install express dotenv cors

RUN npm install -g http-server

COPY . .

RUN --mount=type=secret,id=env cp /run/secrets/env .env

EXPOSE 8080
EXPOSE 3000

CMD ["sh", "-c", "node backend/server.js & http-server -p 8080"]