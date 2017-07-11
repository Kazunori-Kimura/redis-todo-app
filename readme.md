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

time: [zset]
  score: created
  member: todo:{id}

### Todoの並び順(期限)

time: [zset]
  score: limit
  member: todo:{id}

limit未指定なら 2099/01/01 とする

## API

GET /index : アプリのエンドポイント

### REST API

GET /todo[?sort=created|limit] 一覧
POST /todo 
PUT /todo/:id
DELETE /todo/:id


