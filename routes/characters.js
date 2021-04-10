const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const endpoint = "https://swapi.dev/api/people";
const allCharacters = require("../utils/getCharacters");

router.get("/", async (req, res) => {
  const characters = await allCharacters("test");
  res.send(characters);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const request = await fetch(`${endpoint}/${id}`);
  const fetchedCharacter = await request.json();

  if (!fetchedCharacter.name) return res.status(404).send("No character with ID: " + id);

  res.send(fetchedCharacter);
});

module.exports = router;
