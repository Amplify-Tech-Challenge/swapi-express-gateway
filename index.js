const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000;
const characters = require('./routes/characters')

app.use(express.json())
app.use('/api/characters', characters)

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))