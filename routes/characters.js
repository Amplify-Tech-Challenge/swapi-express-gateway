const express = require('express')
const router = express.Router()
const Joi = require("joi")

router.get("/", (req, res) => {
  res.send({message: "hello"})
})

module.exports = router;