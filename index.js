const express = require("express");
const app = express();
app.use(express.json());

const noteRoutes = require('./routes/notes')
const userRoutes = require('./routes/users')

app.use('/', noteRoutes)
app.use('/',userRoutes)

app.listen(8000, () => {
  console.log("Server Started");
}); 
