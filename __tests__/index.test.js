jest.mock('@google-cloud/pubsub', () => {
  return {
    PubSub: jest.fn().mockImplementation(() => {
      return {
        topic: jest.fn().mockImplementation(() => {
          return {
            publishMessage: jest.fn().mockResolvedValue('message-id-1')
          };
        }),
        subscription: jest.fn().mockImplementation(() => {
          return {
            on: jest.fn()
          };
        })
      };
    })
  };
});

import request from 'supertest';
import express from "express";
import { PubSub } from "@google-cloud/pubsub";
import { app, publish, subscribe, handleMessage, bundleMessages } from "../index.mjs";


describe('index#publish', () => {
  it('publishes a message', async () => {
    const message = { foo: 'bar' };
    const messageIds = await publish(message);
    expect(messageIds).toEqual('message-id-1');
  });
});

