import express from "express";
import {Request, Response} from "express";

import graphqlHTTPServer from "./graphqlOptions";

const app = express();

const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
  console.log("originalUrl:" + req.originalUrl);
  res.send('Hello world ' + new Date() +'!');
});

app.use(
  "/graphql",
  graphqlHTTPServer
);

app.listen(PORT, () => {
  console.log("Graphql server now up at port " + PORT)
});