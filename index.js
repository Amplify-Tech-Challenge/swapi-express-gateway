const express = require('express')
, app = express()
, characters = require('./routes/characters')
, cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use('/api/characters', characters)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send("I've got a bad feeling about this...there was an error, contact scottbrabson@gmail.com")
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))