FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn
COPY . .

EXPOSE 8080
CMD [ "node","app.js" ]