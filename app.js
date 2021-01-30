const express = require("express");
const mongoose = require("./db/mongoose.js");
const bodyParser = require("body-parser");
const users = require("./routes/users.js");
const challenges = require("./routes/challenges.js");
const bounties = require("./routes/bounties.js");
const profile = require("./routes/profile.js");
// const error = require("./middlewares/error.js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/v1/user", users);
app.use("/api/v1/challenges", challenges);
app.use("/api/v1/bounties", bounties);
app.use("/api/v1/profile", profile);

// app.use(error);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
