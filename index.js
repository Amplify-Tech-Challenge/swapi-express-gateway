const express = require('express')
const app = express()
const characters = require('./routes/characters')

app.use(express.json())
app.use('/api/characters', characters)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))