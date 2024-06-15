import "./db.js";

import { server } from "./server.js";

server.get("/ping", async (req, res) => {
  try {
    res.send("pong");
  } catch (error) {
    res.send(500, error);
  }
});

server.start(() => console.log("Started server"));
