import express from 'express';
import { PubSub } from '@google-cloud/pubsub';
import { config } from 'dotenv';
import asyncPool from 'tiny-async-pool';

config();
export const app = express();

const {
  PUBSUB_TOPIC,
  PUBSUB_SUBSCRIPTION,
  PUBSUB_PROJECT_ID,
  POOL_CONCURRENCY
} = process.env;


const pubsub = new PubSub({ projectId: PUBSUB_PROJECT_ID });

export const publish = async (data) => {
  const dataBuffer = Buffer.from(JSON.stringify(data));
  console.info(`📫 Publishing message to ${PUBSUB_TOPIC}...`, dataBuffer);
  return await pubsub.topic(PUBSUB_TOPIC).publishMessage({ data: dataBuffer });
  // FOR DEBUGGING, UNCOMMENT THE FOLLOWING LINE AND COMMENT THE ABOVE LINE
  // return new Promise((resolve, reject) => setTimeout(() => resolve('📫 Message published'), 1000));
};

export const subscribe = (subscriptionId) => {
  const subscription = pubsub.subscription(subscriptionId);
  console.info(`📭 Listening for messages on ${subscriptionId}`);
  return subscription
};

export const handleMessage = (message) => {
  console.log(`📬 Received message ${message.id}:`);
  let data;
  data = Buffer.from(message.data, 'base64').toString().trim();
  data = JSON.parse(data);
  console.info({ id: message.id, data });
  message.ack();
};

export const bundleMessages = async (messages) => {
  const results = [];
  for await (const result of asyncPool(POOL_CONCURRENCY, messages, publish)) {
    results.push(result);
  }
  return results;
}

const subscription = subscribe(PUBSUB_SUBSCRIPTION);

subscription.on('message', message => handleMessage(message));

app.use(express.json());

app.post('/publish', async (req, res) => {
  const { message, count } = req.body;
  const messages = Array(count).fill(message);
  const messageIds = await bundleMessages(messages);
  res.send(messageIds);
});

app.listen(3003, () => console.log('📭 Server is running on port 3003'));
