FROM node:lts-alpine

COPY ./ /home

WORKDIR /home

RUN npm install

RUN npm run build

RUN rm .env

ENV PORT=80

CMD ["node", "build/index.js"]