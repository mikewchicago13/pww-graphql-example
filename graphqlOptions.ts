import {graphqlHTTP} from "express-graphql";
import getSchema from "./getSchema";

export default graphqlHTTP({
  schema: getSchema(),
  graphiql: true,
  pretty: true
});