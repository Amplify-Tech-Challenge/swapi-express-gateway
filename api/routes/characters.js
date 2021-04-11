const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const endpoint = "https://swapi.dev/api/people";
const allCharacters = require("../utils/getCharacters");
const compileCharacter = require("../utils/buildCharacter")

router.get("/", async (req, res) => {
  const characters = await allCharacters("test");

  if (!characters) return res.status(500).send("Cannot find character list, internal error");
  res.send(characters);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const request = await fetch(`${endpoint}/${id}`);
  const fetchedCharacter = await request.json();

  if (!fetchedCharacter.name) return res.status(404).send("No character with ID: " + id);

  const completedCharacter = await compileCharacter(fetchedCharacter)

  res.send(completedCharacter);
});

module.exports = router;
