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

class Response {
  get contents(): string {
    return this._contents;
  }

  set contents(value: string) {
    this._contents = value;
  }

  private _contents: string;

  constructor(contents: string) {
    this._contents = contents;
  }
}

const rootValue = {
  goodbye: ({name}: { name: string }): Response => {
    console.log("INSIDE_GOODBYE " + name);
    return new Response('Goodbye ' + name + ' ' + new Date() + '!');
  },
  hello: (): Response => {
    console.log("INSIDE_HELLO");
    return new Response('Hello world ' + new Date() + '!');
  },
};

const options: OptionsData = {
  schema,
  graphiql: true,
  pretty: true,
  rootValue
};

export default graphqlHTTP(options);