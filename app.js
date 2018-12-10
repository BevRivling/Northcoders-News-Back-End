const express = require("express");

const app = express();

const bodyparser = require("body-parser");
const { handle400s, handle404s, handle422s, handle500s } = require("./errors");
const { apiRouter } = require("./routes/apiRouter");

app.use(bodyparser.json());

app.use("/api", apiRouter);
app.use("/*", (req, res, next) =>
  res.status(404).send({ msg: "Page not found" })
);

// Error Handling ----->
app.use(handle400s);
app.use(handle404s);
app.use(handle422s);
app.use(handle500s);

module.exports = { app };
