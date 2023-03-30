import express from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { config } from 'dotenv';

config();
const app = express();

const {
  PUBSUB_TOPIC,
  PUBSUB_SUBSCRIPTION,
  PUBSUB_PROJECT_ID
} = process.env;


const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });

const subscribe = () => {
  const subscription = pubsub.subscription(PUBSUB_SUBSCRIPTION);
  console.info(`📭 Listening for messages on ${PUBSUB_SUBSCRIPTION}`);
  return subscription
};

const handleMessage = (message) => {
  console.log(`📬 Received message ${message.id}:`);
  message.ack();
};

const subscription = subscribe();

subscription.on('message', message => handleMessage);

app.listen(3003, () => console.log('📭 Server is running on port 3003'));