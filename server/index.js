import express from "express"
import mongoose from "mongoose"
import path from "path"
const bodyParser = require('body-parser')
import api from "./routes/api"

const PORT = process.env.PORT || 5000

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

let db = process.env.MONGODB_URI || 'mongodb://localhost/cryptofolio'

mongoose.connect(db, { useMongoClient: true })

app.use(express.static(path.resolve(__dirname, "../react-ui/build")))

app.use("/api", api)

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "../react-ui/build", "index.html"))
})

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
