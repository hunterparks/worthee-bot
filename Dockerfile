FROM node:17

RUN apt-get update || : && apt-get install python -y

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

CMD ["node", "dist/index.js"]