import * as express from "express";
import { Request, Response } from "express";

const app = express();

const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Graphql server now up at port 4000")
});