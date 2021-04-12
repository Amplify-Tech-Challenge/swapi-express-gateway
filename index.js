const express = require('express')
const app = express()
const characters = require('./routes/characters')
const path = require('path')

app.use(express.json())
app.use(express.static('public'));
// app.use(express.static((path.join(__dirname, 'public'))));
app.use('/api/characters', characters)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))