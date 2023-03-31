# Needed a Logging tool for the pubsub sdk

create a `.env` file and add

```
PUBSUB_TOPIC=
PUBSUB_SUBSCRIPTION=
PUBSUB_PROJECT_ID=
POOL_CONCURRENCY=

```

## API

Trigger batches of publishes to a topic using the API. 

`POOL_CONCCURENCY` sets the size of the batch.

`POST /publish`

Accepts `application/json` 

```
{ "message": <any>, "count": <integer> }
```

`message` is duplicated `count` number of times.

No validation at the moment because this is not a real application.
