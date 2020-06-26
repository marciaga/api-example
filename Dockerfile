FROM node:14.4.0
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

FROM node:14.4.0-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .