console.log("Hello aman");

const express = require("express");
const app = express();

app.use((req, res) => {
  res.send({
    msg: "Hello",
  });
});

const PORT = 8888;

app.listen(PORT, () => {
  console.log("I am listening to this ", PORT);
});
