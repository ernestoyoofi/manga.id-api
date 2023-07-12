const express = require("express")
const cors = require("cors")

const port = process.env.PORT || 12500
const app = express()

app.use(cors())
app.get("/", (req, res) => {
  res.redirect(require("./package.json").homepage)
})
app.use(require("./router/low"))
app.use(require("./router/main"))
app.listen(port, () => {
  console.log(`Running this app in › http://localhost:${port}`)
})