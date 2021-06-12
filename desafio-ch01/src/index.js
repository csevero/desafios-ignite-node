const express = require("express");
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

function checkExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  req.user = user;

  next();
}

function checkExistsTodoList(req, res, next) {
  const { id } = req.params;
  const { user } = req;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  req.todo = todo;

  next();
}

app.get("/users", (req, res) => {
  return res.json(users);
});

app.post("/users", (req, res) => {
  const { name, username } = req.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return res.status(400).json({ error: "user already exists" });
  }

  const data = {
    id: uuidV4(),
    name,
    username,
    todos: [],
  };

  users.push(data);

  return res.status(201).json(data);
});

app.get("/todos", checkExistsUserAccount, (req, res) => {
  const { user } = req;

  return res.json(user.todos);
});

app.post("/todos", checkExistsUserAccount, (req, res) => {
  const { user } = req;
  const { title, deadline } = req.body;

  const data = {
    id: uuidV4(),
    title,
    done: false,
    deadline: new Date(deadline),
    create_at: new Date(),
  };

  user.todos.push(data);

  return res.status(201).json(data);
});

app.put(
  "/todos/:id",
  checkExistsUserAccount,
  checkExistsTodoList,
  (req, res) => {
    const { todo } = req;
    const { title, deadline } = req.body;

    todo.title = title;
    todo.deadline = new Date(deadline);

    return res.json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checkExistsUserAccount,
  checkExistsTodoList,
  (req, res) => {
    const { todo } = req;

    todo.done = true;

    return res.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checkExistsUserAccount,
  checkExistsTodoList,
  (req, res) => {
    const { todo, user } = req;

    user.todos.splice(todo, 1);

    return res.status(204).send();
  }
);

module.exports = app;
