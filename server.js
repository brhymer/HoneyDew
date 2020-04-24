const express = require("express");
const port = process.env.PORT || 3550;

const app = express();

app.get("/", (req, res) => {
  res.send("Success");
});

app.listen(port, () => `Server listening @ Port ${port}`);
