const express = require("express");
const app = express();
app.use(express.json());

const noteRoutes = require('./routes/notes')
app.use('/', noteRoutes)

app.listen(8000, () => {
  console.log("Server Started");
});
