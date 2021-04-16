const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const endpoint = "https://swapi.py4e.com/api/people/";
const allCharacters = require("../utils/getCharacters");
const compileCharacter = require("../utils/buildCharacter");

router.get("/", async (req, res) => {
  const {query} = req
  const url = `${endpoint}?search=${query.search}`
  
  const response = await fetch(url)
  const data = await response.json()
  const results = data.results

  const prunedList = results.map(c => {
    const urlsplit = c.url.split("/");
    const id = urlsplit[urlsplit.length - 2]
    const image = `https://swapi-express-gateway.herokuapp.com/assets/images/characters/${id}.jpg`
    const charObj = { name: c.name, id, image };
    return charObj;
  });
  const orderedList = prunedList.sort((a, b) => a.url - b.url);

  res.send(orderedList)
});

router.get("/ssg-paths", async (req, res) => {
  const characters = await allCharacters();

  if (!characters)
    return res
      .status(500)
      .send("I've got a bad feeling about this...Please contact the website admin");

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

  if (!fetchedCharacter.name)
    return res.status(404).send("No character with ID: " + id);

  const compiledCharacter = await compileCharacter(fetchedCharacter);
  const image = `https://swapi-express-gateway.herokuapp.com/assets/images/characters/${id}.jpg`;
  const completeCharacter = { ...compiledCharacter, image };

  res.send(completeCharacter);
});

module.exports = router;
