const express = require("express");
const router = express.Router();
const Joi = require("joi");
const fetch = require("node-fetch");

const endpoint = "https://swapi.dev/api/people";
const allCharacters = require("../utils/getCharacters");

router.get("/", async (req, res) => {
  const characters = await allCharacters("test");
  res.send(characters);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const character = await fetch(`${endpoint}/${id}`);

  if (!character) return res.status(404).send("No character with ID: " + id);

  const { error } = validateRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  res.send(character);
  // do I need to do this? I may not for SSG
  // const character = characters.find
});

const validateRequest = character => {
  const schema = Joi.object({
    name: Joi.string().required(),
    height: Joi.string().required(),
    mass: Joi.string().required(),
    hair_color: Joi.string().required(),
    skin_color: Joi.string().required(),
    eye_color: Joi.string().required(),
    birth_year: Joi.string().required(),
    gender: Joi.string().required(),
    homeworld: Joi.string().required(),
    films: Joi.array().required(),
    species: Joi.array().required(),
    vehicles: Joi.array().required(),
    starships: Joi.array().required(),
  });
  return schema.validate(character);
};

module.exports = router;
