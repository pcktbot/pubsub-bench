FROM node:16-bullseye-slim

ARG PUBSUB_TOPIC
ARG PUBSUB_SUBSCRIPTION
ARG PUBSUB_PROJECT_ID
ARG POOL_CONCURRENCY

RUN ls -la

WORKDIR /app

COPY adc.json /app/adc.json

COPY package*.json ./

RUN npm install

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/adc.json

COPY . .

EXPOSE 3003

CMD ["npm", "start"]
