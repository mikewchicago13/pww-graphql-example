import {graphqlHTTP} from "express-graphql";
import getSchema from "./getSchema";
import getRootValue from "./getRootValue";

export default graphqlHTTP({
  schema: getSchema(),
  graphiql: true,
  pretty: true,
  rootValue: getRootValue()
});