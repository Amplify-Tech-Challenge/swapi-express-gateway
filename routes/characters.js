const express = require("express");
const router = express.Router();
const Joi = require("joi");
const allCharacters = require("../utils/getCharacters");
const fetch = require("node-fetch");


router.get("/", async (req, res) => {
  const data = await allCharacters("test");
  res.send(data);
});

module.exports = router;
