const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updateRepositories = request.body;

  /* 
  findIndex busca o index de um item dentro de um array
  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  ); */

  findRepository = repositories.find((repository) => repository.id === id);

  if (!findRepository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  updateRepositories.likes = findRepository.likes;

  //recebendo no repository o valor atual do index puxado acima e passando nosso novo objeto em cima, enviando dessa forma, caso a gente não passe algum dado para atualizar ele vai mandar os outros dados da mesma forma, sem mexer neles. Forma legal.
  const repository = {
    ...findRepository,
    ...updateRepositories,
  };

  //indo até o index que foi encontrado e passando o nosso novo valor
  findRepository = repository;

  return response.status(201).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes });
});

module.exports = app;
