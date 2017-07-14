// redisデータ作成
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

client.incrAsync("todo:")
  .then((response) => {
    console.log(`todo: => ${response}`);
    const id = response;

    const text = "さんぷる";
    const done = "0";
    const limit = (new Date(2017, 7, 31)).getTime();
    const created = Date.now();

    return client.multi()
      .hmset(`todo:${id}`, "text", text, "done", done, "limit", limit, "created", created)
      .zadd("created:", created, `todo:${id}`)
      .zadd("limit:", limit, `todo:${id}`)
      .execAsync();
  }).then((response) => {
    console.log(response);

    client.quit();
  });

