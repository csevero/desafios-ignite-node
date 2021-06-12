const express = require("express");
const cors = require("cors");
const { v4: uuidV4, validate } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  req.user = user;

  next();
}

function checksTodoExists(req, res, next) {
  const { id } = req.params;
  const { username } = req.headers;

  if (!validate(id)) {
    return res.status(400).json({ error: "uuid is invalid" });
  }

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  req.todo = todo;
  req.user = user;

  next();
}

function checksCreateTodosUserAvailability(req, res, next) {
  const { user } = req;

  if (!user.pro) {
    if (user.todos.length >= 10) {
      return res.status(403).json({ error: "upgrade your plan to pro" });
    }
  }

  next();
}

function findUserById(req, res, next) {
  const { id } = req.params;

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  req.user = user;

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
    pro: false,
    todos: [],
  };

  users.push(data);

  return res.status(201).json(data);
});

app.get("/users/:id", findUserById, (req, res) => {
  const { user } = req;

  return res.json(user);
});

app.get("/todos", checksExistsUserAccount, (req, res) => {
  const { user } = req;

  return res.json(user.todos);
});

app.post(
  "/todos",
  checksExistsUserAccount,
  checksCreateTodosUserAvailability,
  (req, res) => {
    const { user } = req;
    const { title, deadline } = req.body;

    const data = {
      id: uuidV4(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date(),
    };

    user.todos.push(data);

    return res.status(201).json(data);
  }
);

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checksTodoExists,
  checksCreateTodosUserAvailability,
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
  checksExistsUserAccount,
  checksTodoExists,
  checksCreateTodosUserAvailability,
  (req, res) => {
    const { todo } = req;

    todo.done = true;

    return res.json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksTodoExists,
  (req, res) => {
    const { todo, user } = req;

    user.todos.splice(todo, 1);

    return res.status(204).send();
  }
);

module.exports = {
  app,
  users,
  checksCreateTodosUserAvailability,
  checksTodoExists,
  checksExistsUserAccount,
  findUserById,
};
