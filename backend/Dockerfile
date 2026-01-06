FROM node:25-alpine

ENV PORT=""
WORKDIR /app

COPY package*.json ./

RUN npm i 

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]