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

let keys;

/**
 * limit順に取得する
 */
client.zrangeAsync("limit:", 0, -1)
  .then((res) => {
    keys = res;

    // 各要素について...
    return Promise.all(res.map((item) => {
      // hashを取得
      return client.hmgetAsync(item, "text", "done", "limit", "created");
    }));
  }).then((res) => {
    const ret = [];

    res.forEach((item, index) => {
      ret.push({
        id: parseInt(keys[index].replace("todo:", "")),
        text: item[0],
        done: item[1],
        limit: parseInt(item[2]),
        created: parseInt(item[3])
      });
    });
    console.log(ret);

    client.quit();
  });

