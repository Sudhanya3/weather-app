FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install express dotenv cors

RUN npm install -g http-server

RUN npm install --save-dev sinon node-fetch chai mocha jsdom chai-http

RUN npm install jsdom-global --save-dev

COPY . .

EXPOSE 8080
EXPOSE 3000

CMD ["sh", "-c", "node backend/server.js & http-server -p 8080"]