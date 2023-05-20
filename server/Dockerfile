# syntax=docker/dockerfile:1

FROM node:14.17.6-bullseye-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV=production

CMD node dist/server.js