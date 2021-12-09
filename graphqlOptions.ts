import {buildSchema} from "graphql";
import {readFileSync} from 'fs';
import path from "path";
import {graphqlHTTP} from "express-graphql";

const fullPath = path.join(__dirname, "schema.graphqls");
const buffer = readFileSync(fullPath);
const contents = buffer.toString();
console.log(contents);
const schema = buildSchema(contents);

const rootValue = {
  // goodbye: ( name: string ) => {
  //   console.log("INSIDE_GOODBYE " + name);
  //   return 'Goodbye ' + name + ' ' + new Date() + '!';
  // },
  // hello: () => {
  //   console.log("INSIDE_HELLO");
  //   return 'Hello world ' + new Date() + '!';
  // },
};

export default graphqlHTTP({
  schema: schema,
  rootValue: rootValue,
  graphiql: true,
});