// test
const bluebird = require("bluebird");
const redis = require("redis");

// promisify
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * Redis Client
 */
const client = redis.createClient();

client.on("error", (err) => {
  console.error(err);
});

const id = 4;

client.multi()
  .del(`todo:${id}`)
  .zrem("created:", `todo:${id}`)
  .zrem("limit:", `todo:${id}`)
  .execAsync()
  .then((response) => {
    console.log(response);
    client.quit();
  }).catch((err) => {
    console.error(err);
    client.quit();
  });
