FROM node:17

RUN apt-get update || : && apt-get install python -y && mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

CMD ["node", "dist/index.js"]