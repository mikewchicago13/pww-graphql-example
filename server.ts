import * as express from "express";
import {Request, Response} from "express";
import {graphqlHTTP} from "express-graphql";
import {buildSchema} from "graphql";

const app = express();

const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => {
    console.log("INSIDE_HELLO");
    return 'Hello world!';
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log("Graphql server now up at port 4000")
});