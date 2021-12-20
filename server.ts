import express, {NextFunction, Request, Response} from "express";
import cors from "cors";

import graphqlHTTPServer from "./graphql/graphqlOptions";

const app = express();

const PORT = 4000;

process.title = process.argv[2];

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  const now = new Date();
  console.log("now: " + now);
  console.log("headers", JSON.stringify(req.headers));
  res.send('Hello world ' + now +'!');
});

app.use((req: Request, _: Response, next: NextFunction) => {
  const now = new Date();
  console.log("now: " + now);
  console.log("headers", JSON.stringify(req.headers));
  next();
});

app.use(
  "/graphql",
  graphqlHTTPServer
);

app.listen(PORT, () => {
  console.log("Graphql server now up at port " + PORT)
});
