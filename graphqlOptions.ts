import {buildSchema} from "graphql";
import {readFileSync} from 'fs';

const buffer = readFileSync("./schema.graphql");
const contents = buffer.toString();
console.log(contents);
const schema = buildSchema(contents);

const rootValue = {
  hello: () => {
    console.log("INSIDE_HELLO");
    return 'Hello world ' + new Date() +'!';
  },
};

export default {
  schema,
  rootValue
}