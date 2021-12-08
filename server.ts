import express from "express";
import {Request, Response} from "express";
import {graphqlHTTP} from "express-graphql";
import graphqlOptions from "./graphqlOptions";

const app = express();

const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
  console.log("originalUrl:" + req.originalUrl);
  res.send('Hello world ' + new Date() +'!');
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlOptions.schema,
    rootValue: graphqlOptions.rootValue,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log("Graphql server now up at port 4000")
});