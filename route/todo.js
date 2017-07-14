// route/todo.js
// api/todo/* の処理
const express = require("express");
const router = express.Router();
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

// listを返す
router.get("/", (req, res) => {
  // ソート順を取得
  const key = req.query.sort === "limit" ? "limit:" : "created:";

  let sortedKeys; //ソートされたキー

  // zsetを取得
  client.zrangeAsync(key, 0, -1)
    .then((response) => {
      // 取得したキーを保持
      sortedKeys = response;

      // 取得した各要素について...
      return Promise.all(response.map((item) => {
        // hashを取得
        return client.hmgetAsync(item, "text", "done", "limit", "created");
      }));
    }).then((response) => {
      // 値を返却する
      const ret = [];
      response.forEach((item, index) => {
        ret.push({
          id: parseInt(sortedKeys[index].replace("todo:", "")),
          text: item[0],
          done: item[1] === "1",
          limit: parseInt(item[2]),
          created: parseInt(item[3])
        });
      });

      res.json(ret);
    }).catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ error: err });
    });
});

// 登録
router.post("/", (req, res) => {
  let id = "";
  const text = req.body.text;
  const done = req.body.done ? "1" : "0";
  const limit = req.body.limit ? req.body.limit : 4070876400000; // 2099/01/01
  const created = Date.now();

  // incr
  client.incrAsync("todo:")
    .then((response) => {
      id = response;

      // multi -> hmset -> zadd -> zadd -> exec
      return client.multi()
        .hmset(`todo:${id}`, "text", text, "done", done, "limit", limit, "created", created)
        .zadd("created:", created, `todo:${id}`)
        .zadd("limit:", limit, `todo:${id}`)
        .execAsync();

    }).then((response) => {
      // 登録成功
      res.status(201); //created
      res.json({ id });
    }).catch((err) => {
      // 登録失敗
      console.error(err);
      res.status(500);
      res.json({ error: err });
    });
});

// 更新
router.put("/:id", (req, res) => {
  const id = req.params.id;

  // multi -> hmset -> zadd -> zadd -> exec
  client.multi()
    .hmset(`todo:${id}`, "text", text, "done", done, "limit", limit, "created", created)
    .zadd("created:", created, `todo:${id}`)
    .zadd("limit:", limit, `todo:${id}`)
    .execAsync()
    .then((response) => {
      // 更新成功
      res.status(204); //No Content
      res.end();
    }).catch((err) => {
      // 更新失敗
      console.error(err);
      res.status(500);
      res.json({ error: err });
    });
});

// 削除
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  // multi -> del -> zrem -> zrem -> exec
  client.multi()
    .del(`todo:${id}`)
    .zrem("created:", `todo:${id}`)
    .zrem("limit:", `todo:${id}`)
    .execAsync()
    .then((response) => {
      // 削除成功
      res.status(204); //No Content
      res.end();
    }).catch((err) => {
      console.error(err);
      res.status(500);
      res.json({ error: err });
    });
});

module.exports = router;
