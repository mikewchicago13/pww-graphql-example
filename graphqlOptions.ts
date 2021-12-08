import {buildSchema} from "graphql";

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

export default {
  schema,
  rootValue
}
