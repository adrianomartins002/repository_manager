const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

function validateRepoId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Invalid repository id" });

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;


  let repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const updateRepo = {
    ...request.body
  }

  if (repositories.filter(repo => repo.id == id).length <= 0) {
    return response.status(404).json({ message: "Not found" });
  }

  repositories = repositories.map(repo => {
    if (repo.id == id && (updateRepo.title || updateRepo.techs || updateRepo.url)) {

      repo = {
        ...repo,
        ...updateRepo
      }
      return repo;
    } else {
      return repo;
    }

  });

  const updated = repositories.filter(repo => repo.id == id)[0];

  return response.status(200).json(updated);
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;

  if (repositories.filter(repo => repo.id == id).length <= 0)
    return response.status(404).json({ message: "Not found" });

  repositories = [];

  repositories = repositories.map(repo => {
    if (repo.id != id)
      return repo;
  })

  response.status(204).json(repositories);

});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
  const { id } = request.params;

  if (repositories.filter(repo => repo.id == id).length <= 0)
    return response.status(404).json({ message: "Not found" });

  let qtdLikes = 0;

  repositories = repositories.map(repo => {
    if (repo.id == id) {
      repo = {
        ...repo,
        likes: repo.likes + 1
      }
      qtdLikes = repo.likes;
      return repo;
    } else {
      return repo;
    }
  })

  response.status(200).json({ likes: qtdLikes });

});

module.exports = app;
