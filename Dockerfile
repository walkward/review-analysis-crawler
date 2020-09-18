FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

CMD [ "npm", "run", "start" ]
