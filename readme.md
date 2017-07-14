# redis-todo-app


## Redis

### TodoのID管理

todo: [string]

### Todo情報

todo:{id} [hash]
  text: string
  done: 0 or 1
  limit: Date(ms)
  created: Date(ms)

### Todoの並び順(時間)

created: [zset]
  score: created
  member: todo:{id}

昇順に取得

### Todoの並び順(期限)

limit: [zset]
  score: limit
  member: todo:{id}

昇順に取得

limit未指定なら 2099/01/01 とする


### Todoの登録

incr todo:
multi
hmset todo:{id} text {text} done 0 limit 4070876400000 created 1499764588393
zadd created: 1499764588393 todo:{id}
zadd limit: 4070876400000 todo:{id}
exec

更新時は `incr` が不要

### Todoの削除

multi
del todo:{id}
zrem created: todo:{id}
zrem limit: todo:{id}
exec

## API

GET /index : アプリのエンドポイント

### REST API

GET /todo[?sort=created|limit] 一覧
POST /todo 
PUT /todo/:id
DELETE /todo/:id


