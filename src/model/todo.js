// model/todo.js

class Todo {
  constructor(todo) {
    this.id = todo.id;
    this.text = todo.text;
    this.limit = todo.limit ? todo.limit : 4070876400000; // 2099/01/01
    this.created = todo.created ? todo.created : Date.now();
  }
}
module.exports = Todo;
