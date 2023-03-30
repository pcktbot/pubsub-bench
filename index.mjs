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

const subscribe = (subscriptionId) => {
  const subscription = pubsub.subscription(subscriptionId);
  console.info(`📭 Listening for messages on ${subscriptionId}`);
  return subscription
};

const handleMessage = (message) => {
  console.log(`📬 Received message ${message.id}:`);
  let data;
  data = Buffer.from(message.data, 'base64').toString().trim();
  data = JSON.parse(data);
  console.log(data);
  message.ack();
};

const subscription = subscribe(PUBSUB_SUBSCRIPTION);

subscription.on('message', message => handleMessage(message));

app.listen(3003, () => console.log('📭 Server is running on port 3003'));