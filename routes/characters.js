const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const endpoint = "https://swapi.py4e.com/api/people/";
const allCharacters = require("../utils/getCharacters");
const compileCharacter = require("../utils/buildCharacter")

router.get("/", async (req, res) => {
  // pass any arg into allCharacters() to return only 1 page of results
  const characters = await allCharacters();

  if (!characters) return res.status(500).send("Something went sideways. Please contact the website admin");

  res.send(characters);
});

router.get("/ssg-paths", async (req, res) => {
  // pass any arg into allCharacters() to return only 1 page of results
  const characters = await allCharacters();
  
  if (!characters) return res.status(500).send("Something went sideways. Please contact the website admin");

  const paths = characters.map(char => {
    const splitUrl = char.url.split("/");
    const id = splitUrl[splitUrl.length - 2];
    return id;
  });
  
  res.send(paths);
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
