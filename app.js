const express = require("express");
const fs = require("fs");
const port = 3000;
const server = express();
server.use(express.static("public"));

server.listen(port, (error) => {
  if (error) {
    console.log("error: " + error);
  } else {
    console.log("server listening on port: " + port);
  }
});
