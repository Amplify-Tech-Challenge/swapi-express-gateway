// const https = require('https');
// const fs = require("mz/fs");
const express = require('express')

// async function getCert() {
//   const {key, cert} = await (async () => {
//     const certdir = (await fs.readdir("/etc/letsencrypt/live"))[0];
//   //brew link --overwrite python@3.9
//     return {
//       key: await fs.readFile(`/etc/letsencrypt/live/${certdir}/privkey.pem`),
//       cert: await fs.readFile(`/etc/letsencrypt/live/${certdir}/fullchain.pem`)
//     }
//   })();
//   return await {key, cert}
// }

const app = express()
const helmet = require('helmet')
const characters = require('./routes/characters')

app.use(express.static(__dirname, { dotfiles: 'allow' }))
app.use(helmet())
app.use(express.json())
app.use('/api/characters', characters)
// app.disable('x-powered-by')  // part of helmet by default
// Create a file containing just this data:

// BGDCWi3TStcwgYPI_jS_rh2br-CTCX1zUePDbph1KFU.pdnwNBmxzfdx1yIm-6EvVWnIHnSK7ygqkbHsxosYxxg

// And make it available on your web server at this URL:

// http://swapi-express-gateway.herokuapp.com/.well-known/acme-challenge/BGDCWi3TStcwgYPI_jS_rh2br-CTCX1zUePDbph1KFU
// const httpsServer = https.createServer(getCert(), app).listen(443, () => console.log(`Server running on port: ${443}`))

const PORT = process.env.PORT || 80;
// const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

app.get("/", async (req, res) => {
  res.send('debugging branch');
});