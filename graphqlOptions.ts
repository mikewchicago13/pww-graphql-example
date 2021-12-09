import {buildSchema} from "graphql";
import {readFileSync} from 'fs';
import path from "path";
import {
  graphqlHTTP,
  OptionsData,
} from "express-graphql";

const fullPath = path.join(__dirname, "schema.graphqls");
const contents = readFileSync(fullPath).toString();
console.log(contents);
const schema = buildSchema(contents);

const rootValue = {
  goodbye: (name: string): String => {
    console.log("INSIDE_GOODBYE " + name);
    return 'Goodbye ' + name + ' ' + new Date() + '!';
  },
  hello: (): String => {
    console.log("INSIDE_HELLO");
    return 'Hello world ' + new Date() + '!';
  },
};


const options: OptionsData = {
  schema,
  graphiql: true,
  pretty: true,
  rootValue,
  extensions: info => {
    const operationName = info.operationName;
    console.log("operationName " + operationName)
    return {}
  }
};

export default graphqlHTTP(options);